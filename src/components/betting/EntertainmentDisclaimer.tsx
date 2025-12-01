
import React from 'react';
import { AlertCircle } from 'lucide-react';

const EntertainmentDisclaimer = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-amber-800">
          <p className="font-medium">ENTERTAINMENT PLATFORM ONLY</p>
          <p className="mt-1">
            This is a sports prediction entertainment platform with sweepstakes prizes. 
            Not real money gambling. Predictions are for fun and potential sweepstakes entries only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntertainmentDisclaimer;
