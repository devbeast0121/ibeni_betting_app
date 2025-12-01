import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[EXCHANGE-PUBLIC-TOKEN] ${step}${detailsStr}`);
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

    const { public_token, metadata } = await req.json();
    if (!public_token) throw new Error("Public token is required");
    
    logStep("Exchanging public token", { metadata });

    // Exchange public token for access token
    const plaidResponse = await fetch("https://production.plaid.com/link/token/exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: plaidClientId,
        secret: plaidSecret,
        public_token: public_token,
      }),
    });

    const plaidData = await plaidResponse.json();
    
    if (!plaidResponse.ok) {
      throw new Error(`Plaid error: ${plaidData.error_message || 'Unknown error'}`);
    }

    logStep("Access token received", { item_id: plaidData.item_id });

    // Get account details
    const accountsResponse = await fetch("https://production.plaid.com/accounts/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: plaidClientId,
        secret: plaidSecret,
        access_token: plaidData.access_token,
      }),
    });

    const accountsData = await accountsResponse.json();
    
    if (!accountsResponse.ok) {
      throw new Error(`Plaid accounts error: ${accountsData.error_message || 'Unknown error'}`);
    }

    // Store the account in our database
    const account = accountsData.accounts[0]; // Use the first account
    const { error: insertError } = await supabaseClient.from("plaid_accounts").insert({
      user_id: user.id,
      plaid_access_token: plaidData.access_token,
      plaid_item_id: plaidData.item_id,
      account_id: account.account_id,
      account_name: account.name,
      account_type: account.type,
      account_subtype: account.subtype,
    });

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    logStep("Account linked successfully", { account_id: account.account_id });

    return new Response(JSON.stringify({ 
      success: true,
      account: {
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in exchange-public-token", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});