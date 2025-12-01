import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use service role key for database updates
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  // Use anon key for user authentication
  const supabaseAuth = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get recent payment sessions for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      logStep("No customer found");
      return new Response(JSON.stringify({ verified: false, message: "No customer found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Get recent checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 10,
    });

    logStep("Found sessions", { count: sessions.data.length });

    let updatedBalance = false;
    
    for (const session of sessions.data) {
      if (session.payment_status === 'paid' && session.metadata?.type === 'growth_cash_deposit') {
        const amount = parseFloat(session.metadata.amount);
        const sessionUserId = session.metadata.user_id;
        
        if (sessionUserId !== user.id) continue;
        
        logStep("Processing paid session", { 
          sessionId: session.id, 
          amount, 
          userId: sessionUserId 
        });

        // Check if we already processed this session
        const { data: existingDeposit } = await supabaseService
          .from('deposits')
          .select('id')
          .eq('payment_method', `stripe_session_${session.id}`)
          .single();

        if (existingDeposit) {
          logStep("Session already processed", { sessionId: session.id });
          continue;
        }

        // Create deposit record
        const { error: depositError } = await supabaseService
          .from('deposits')
          .insert({
            user_id: user.id,
            amount: amount,
            status: 'completed',
            payment_method: `stripe_session_${session.id}`,
            deposit_type: 'growth_cash'
          });

        if (depositError) {
          logStep("Error creating deposit", { error: depositError });
          continue;
        }

        // Update user balance
        const { data: currentBalance } = await supabaseService
          .from('user_balances')
          .select('growth_cash')
          .eq('user_id', user.id)
          .single();

        const newBalance = (currentBalance?.growth_cash || 0) + amount;
        
        const { error: balanceError } = await supabaseService
          .from('user_balances')
          .update({ 
            growth_cash: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (balanceError) {
          logStep("Error updating balance", { error: balanceError });
          continue;
        }

        logStep("Successfully updated balance", { 
          sessionId: session.id, 
          amount, 
          newBalance 
        });
        updatedBalance = true;
      }
    }

    return new Response(JSON.stringify({ 
      verified: true, 
      updated: updatedBalance,
      message: updatedBalance ? "Balance updated successfully" : "No new payments to process"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});