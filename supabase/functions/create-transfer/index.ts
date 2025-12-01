import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TRANSFER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const plaidClientId = Deno.env.get("PLAID_CLIENT_ID");
    const plaidSecret = Deno.env.get("PLAID_SECRET");
    
    if (!plaidClientId || !plaidSecret) {
      throw new Error("Plaid credentials not configured");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");

    const { amount, transfer_type, plaid_account_id } = await req.json();
    
    if (!amount || !transfer_type || !plaid_account_id) {
      throw new Error("Amount, transfer type, and account ID are required");
    }

    if (amount < 10) {
      throw new Error("Minimum transfer amount is $10");
    }

    logStep("Creating transfer", { amount, transfer_type, plaid_account_id });

    // Get the Plaid account details
    const { data: plaidAccount, error: accountError } = await supabaseClient
      .from("plaid_accounts")
      .select("*")
      .eq("id", plaid_account_id)
      .eq("user_id", user.id)
      .single();

    if (accountError || !plaidAccount) {
      throw new Error("Bank account not found");
    }

    // Create transfer intent with Plaid
    const transferResponse = await fetch("https://production.plaid.com/transfer/intent/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: plaidClientId,
        secret: plaidSecret,
        account_id: plaidAccount.account_id,
        mode: "STANDARD",
        amount: {
          value: amount,
          currency: "USD",
        },
        description: transfer_type === 'deposit' ? 'Growth Cash Deposit' : 'Withdrawal',
        ach_class: "WEB",
        user: {
          legal_name: user.email, // In production, you'd have proper user name
        },
      }),
    });

    const transferData = await transferResponse.json();
    
    if (!transferResponse.ok) {
      throw new Error(`Plaid transfer error: ${transferData.error_message || 'Unknown error'}`);
    }

    // Store the transfer in our database
    const { data: transfer, error: insertError } = await supabaseClient
      .from("ach_transfers")
      .insert({
        user_id: user.id,
        plaid_account_id: plaid_account_id,
        amount: amount,
        transfer_type: transfer_type,
        status: 'pending',
        plaid_transfer_id: transferData.transfer_intent.id,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    // Update user balance immediately for deposits (pending verification)
    if (transfer_type === 'deposit') {
      const { error: balanceError } = await supabaseClient
        .from("user_balances")
        .upsert({
          user_id: user.id,
          growth_cash: amount, // This would be added to existing balance in production
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (balanceError) {
        logStep("Balance update error", { error: balanceError.message });
      }
    }

    logStep("Transfer created successfully", { transfer_id: transfer.id });

    return new Response(JSON.stringify({ 
      success: true,
      transfer: {
        id: transfer.id,
        amount: transfer.amount,
        type: transfer.transfer_type,
        status: transfer.status,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-transfer", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});