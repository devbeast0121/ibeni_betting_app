
import React from 'react';

const TermsFooter = () => {
  return (
    <footer className="py-4 border-t">
      <div className="container">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div>© 2025 ibeni. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-foreground">Terms</a>
            <a href="/terms#privacy" className="hover:text-foreground">Privacy</a>
            <a href="/terms#sweep" className="hover:text-foreground">Sweepstakes Rules</a>
          </div>
        </div>
        <div className="text-xs text-muted-foreground border-t pt-3">
          <p className="mb-1">DISCLAIMER: This is a sweepstakes platform. No purchase necessary to enter or win. Void where prohibited. A purchase will not increase your chances of winning. Participation constitutes entrant's full and unconditional agreement to and acceptance of these Official Rules.</p>
          <p className="mb-1">FINANCIAL DISCLAIMER: Any investment and performance information shown is for illustrative and educational purposes only and is not intended to be investment advice. Past performance is not indicative of future results. Investing involves risk including the possible loss of principal.</p>
          <p className="mb-1">SPORTS PREDICTIONS DISCLAIMER: The sports predictions offered on this platform are for entertainment purposes only. ibeni is not affiliated with any professional sports leagues or teams.</p>
          <p className="mb-1">NO REAL MONEY GAMBLING: ibeni does not offer real money gambling services. Tokens and entries have no cash value and cannot be exchanged for real money.</p>
          <p className="mb-1"><strong>PLATFORM OPERATION FEES:</strong> 10% fee on winnings when you win, 10% fee on bet amount when you lose. Membership fees support platform operations. All payments are final and non-refundable.</p>
          <p><strong>NO REFUNDS:</strong> All payments, fees, and deposits are final and non-refundable under any circumstances.</p>
        </div>
      </div>
    </footer>
  );
};

export default TermsFooter;
