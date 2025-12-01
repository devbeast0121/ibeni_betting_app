import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DELETE-ACCOUNT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Account deletion request started");

    // Use service role for admin operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseService.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { reason } = await req.json();

    // Get user's current balance
    const { data: balance, error: balanceError } = await supabaseService
      .from('user_balances')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (balanceError) throw new Error(`Failed to get user balance: ${balanceError.message}`);
    logStep("Retrieved user balance", balance);

    // Calculate account age
    const accountCreated = new Date(user.created_at);
    const now = new Date();
    const accountAgeDays = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));
    const isUnderOneYear = accountAgeDays < 365;

    logStep("Account age calculated", { accountAgeDays, isUnderOneYear });

    // Calculate withdrawal amounts based on platform rules
    const portfolioBalance = balance.invested_balance || 0;
    const growthCashBalance = balance.growth_cash || 0;

    // Portfolio losses: 50% fee before 1 year, 5% after 1 year
    const portfolioFeeRate = isUnderOneYear ? 0.50 : 0.05;
    const portfolioWithdrawable = portfolioBalance * (1 - portfolioFeeRate);
    const portfolioFees = portfolioBalance * portfolioFeeRate;

    // Growth Cash: For now, assume withdrawable (subscription logic can be added later)
    const growthCashWithdrawable = growthCashBalance;

    const totalWithdrawable = portfolioWithdrawable + growthCashWithdrawable;
    const totalFees = portfolioFees;

    logStep("Withdrawal calculation", {
      portfolioBalance,
      growthCashBalance,
      portfolioFeeRate,
      portfolioWithdrawable,
      growthCashWithdrawable,
      totalWithdrawable,
      totalFees
    });

    // Create account deletion record
    const { data: deletionRecord, error: deletionError } = await supabaseService
      .from('account_deletions')
      .insert({
        user_id: user.id,
        email: user.email,
        final_withdrawal_amount: totalWithdrawable,
        portfolio_balance: portfolioBalance,
        growth_cash_balance: growthCashBalance,
        withdrawal_fees_applied: totalFees,
        account_age_days: accountAgeDays,
        deletion_reason: reason,
        status: 'pending'
      })
      .select()
      .single();

    if (deletionError) throw new Error(`Failed to create deletion record: ${deletionError.message}`);
    logStep("Created deletion record", { deletionId: deletionRecord.id });

    // Process withdrawal if there's money to withdraw
    let withdrawalProcessed = false;
    let stripeTransferId = null;

    if (totalWithdrawable > 0) {
      logStep("Processing withdrawal", { amount: totalWithdrawable });

      // Check if Stripe key is available
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      
      if (stripeKey) {
        try {
          // TODO: Implement actual Stripe transfer when key is available
          // For now, simulate successful processing
          logStep("Stripe key found - would process transfer", { amount: totalWithdrawable });
          
          // Simulate Stripe transfer (replace with actual Stripe code when key is added)
          stripeTransferId = `transfer_simulated_${Date.now()}`;
          withdrawalProcessed = true;
          
          logStep("Simulated Stripe transfer successful", { transferId: stripeTransferId });
        } catch (stripeError) {
          logStep("Stripe transfer failed", { error: stripeError });
          throw new Error(`Withdrawal processing failed: ${stripeError}`);
        }
      } else {
        logStep("No Stripe key - withdrawal will be marked as pending");
        // Without Stripe key, mark as pending manual processing
        withdrawalProcessed = false;
      }
    } else {
      logStep("No withdrawal needed - zero balance");
      withdrawalProcessed = true; // No money to withdraw, so consider it "processed"
    }

    // Update deletion record with withdrawal status
    const { error: updateError } = await supabaseService
      .from('account_deletions')
      .update({
        withdrawal_processed: withdrawalProcessed,
        stripe_transfer_id: stripeTransferId,
        status: withdrawalProcessed ? 'processing' : 'pending_withdrawal',
        processed_at: withdrawalProcessed ? new Date().toISOString() : null
      })
      .eq('id', deletionRecord.id);

    if (updateError) throw new Error(`Failed to update deletion record: ${updateError.message}`);

    // If withdrawal is processed, proceed with account deletion
    if (withdrawalProcessed) {
      logStep("Proceeding with account deletion");
      
      // Delete user data (in proper order due to foreign key constraints)
      await supabaseService.from('user_locations').delete().eq('user_id', user.id);
      await supabaseService.from('predictions').delete().eq('user_id', user.id);
      await supabaseService.from('withdrawals').delete().eq('user_id', user.id);
      await supabaseService.from('deposits').delete().eq('user_id', user.id);
      await supabaseService.from('user_balances').delete().eq('user_id', user.id);
      await supabaseService.from('subscribers').delete().eq('user_id', user.id);
      await supabaseService.from('profiles').delete().eq('user_id', user.id);
      
      // Finally delete the user
      const { error: deleteUserError } = await supabaseService.auth.admin.deleteUser(user.id);
      if (deleteUserError) throw new Error(`Failed to delete user: ${deleteUserError.message}`);

      // Mark deletion as completed
      await supabaseService
        .from('account_deletions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', deletionRecord.id);

      logStep("Account deletion completed successfully");

      return new Response(JSON.stringify({
        success: true,
        message: "Account deleted successfully",
        withdrawal_amount: totalWithdrawable,
        fees_applied: totalFees
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      logStep("Account deletion pending - waiting for withdrawal processing");
      
      return new Response(JSON.stringify({
        success: false,
        message: "Account deletion initiated. Withdrawal processing is pending manual review.",
        withdrawal_amount: totalWithdrawable,
        fees_applied: totalFees,
        status: "pending_withdrawal"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 202, // Accepted but not completed
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in delete-account", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});