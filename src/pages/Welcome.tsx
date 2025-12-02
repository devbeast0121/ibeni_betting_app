import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TrendingUp } from 'lucide-react';
import WelcomeLogin from '@/components/welcome/WelcomeLogin';
import { useAuth } from '@/contexts/AuthContext';

const Welcome = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const navigate = useNavigate();
  
  const slides = [
    {
      title: "Stop Throwing Money Away",
      description: "Traditional sports betting is designed to take your money forever when you lose. With ibeni, we've revolutionized sports entertainment to end this cycle - you know your fixed costs upfront while still getting the thrill of winning.",
      image: "💸",
      bgColor: "from-red-50 to-orange-50"
    },
    {
      title: "The Problem with Traditional Betting",
      description: "Bet $100 → Lose → $100 completely gone forever. Repeat until your bankroll is depleted. Traditional betting offers no educational value and no recovery from losses.",
      image: "❌",
      bgColor: "from-red-50 to-red-100"
    },
    {
      title: "The ibeni Solution: Fixed Costs",
      description: "With ibeni, you pay exactly 10% on winnings when you win, 10% on bet amount when you lose - no hidden fees, no surprises. You always know your costs upfront and can budget with confidence.",
      image: "💡",
      bgColor: "from-blue-50 to-green-50"
    },
    {
      title: "When You Win: Growth Cash",
      description: "Win your prediction → Get Growth Cash rewards. Subscribers can withdraw Growth Cash winnings after a 3-month waiting period. You get the thrill of being right AND financial rewards.",
      image: "🏆",
      bgColor: "from-green-50 to-blue-50"
    },
    {
      title: "When You Lose: Portfolio Simulation",
      description: "Lose your prediction → 10% platform fee deducted, remaining 90% goes to portfolio simulation. Turn losses into learning opportunities - withdrawable after one year with additional fees (5% after 1yr, 50% before).",
      image: "📈",
      bgColor: "from-purple-50 to-blue-50"
    },
    {
      title: "Harm Reduction Philosophy",
      description: "We know you can't simply stop enjoying sports predictions. Instead of fighting these impulses, we've created a system that satisfies them while providing educational value and reducing financial harm.",
      image: "🛡️",
      bgColor: "from-green-50 to-teal-50"
    }
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b pt-8 md:mt-4 pb-4">
        <div className="container">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-accent mr-2" />
            <span className="font-bold text-xl">Ibeni</span>
          </div>
          
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            {currentStep < 6 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-1">
                    {slides.map((_, index) => (
                      <div 
                        key={index} 
                        className={`h-1 w-4 rounded-full ${currentStep === index ? 'bg-primary' : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{currentStep + 1} of {slides.length}</span>
                </div>
                
                <Carousel className="w-full">
                  <CarouselContent>
                    {slides.map((slide, index) => (
                      <CarouselItem key={index} className={currentStep === index ? '' : 'hidden'}>
                        <div className={`flex flex-col items-center text-center p-6 rounded-lg bg-gradient-to-r ${slide.bgColor} border border-opacity-20`}>
                          <div className="text-4xl mb-4">{slide.image}</div>
                          <h2 className="text-xl font-bold mb-3">{slide.title}</h2>
                          <p className="text-muted-foreground mb-4 leading-relaxed">{slide.description}</p>
                          
                          {index === 0 && (
                            <div className="bg-blue-50 p-3 rounded-lg text-xs md:text-sm text-blue-800 mt-2 border border-blue-200">
                              <strong>Revolutionary Approach:</strong> ibeni transforms sports entertainment from money-throwing to educational value
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="bg-green-50 p-3 rounded-lg text-xs md:text-sm text-green-800 mt-2 border border-green-200">
                              <strong>Win:</strong> Win $200 → $20 fee (10%) = $180 Growth Cash | <strong>Lose:</strong> Bet $100 → $10 fee, $90 to portfolio
                            </div>
                          )}
                          
                          {index === 4 && (
                            <div className="bg-purple-50 p-3 rounded-lg text-xs md:text-sm text-purple-800 mt-2 border border-purple-200">
                              <strong>Smart Recovery:</strong> Your "losses" become redeemable portfolio value instead of disappearing forever
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                
                <div className="flex justify-between">
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  <div className="flex-1"></div>
                  <Button onClick={handleNext}>
                    {currentStep === 5 ? 'Review Terms' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : currentStep === 6 ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Terms & Conditions</h2>
                  <p className="text-muted-foreground">Please review and accept our terms before continuing</p>
                </div>
                
                <div className="border rounded-md p-4 h-48 overflow-y-auto mb-4 text-xs md:text-sm text-muted-foreground">
                  <p className="mb-4">By using ibeni, you agree to the following terms:</p>
                  <p className="mb-4"><strong>1. Withdrawal Rules:</strong> Growth Cash winnings may be withdrawn by Premium subscribers after a 3-month waiting period. Free members cannot withdraw Growth Cash winnings. Portfolio losses may be withdrawn by all members after one year with additional withdrawal fees: 5% after one year, 50% before one year.</p>
                  <p className="mb-4"><strong>2. Platform Fees:</strong> 10% fee on winnings when you win, 10% fee on bet amount when you lose. This fee is deducted from each bet result.</p>
                  <p className="mb-4"><strong>3. Withdrawal Fees:</strong> Additional fees apply when withdrawing: 50% fee if withdrawn before one year, 5% fee after one year. Bonus bet winnings (Premium members only) have zero withdrawal fees.</p>
                  <p className="mb-4"><strong>4. Portfolio Simulation:</strong> No actual investing occurs. Values shown are simulated prize amounts for entertainment and educational purposes only.</p>
                  <p className="mb-4"><strong>4. No Gambling:</strong> This platform operates as a sweepstakes entertainment platform, not gambling. All activities are for entertainment and educational purposes.</p>
                  <p className="mb-4"><strong>5. No Refunds:</strong> All payments, fees, and subscriptions are final and non-refundable under any circumstances.</p>
                  <p className="mb-4"><strong>6. Harm Reduction:</strong> Platform designed for responsible entertainment with educational value rather than pure gambling.</p>
                  <p>For complete details, please refer to our <a href="/terms" className="text-accent underline">full Terms of Service</a>.</p>
                </div>
                
                <div className="flex items-start space-x-2 mb-6">
                  <Checkbox 
                    id="terms" 
                    checked={termsAgreed}
                    onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-xs md:text-sm cursor-pointer"
                  >
                    I have read and agree to the Terms & Conditions, including withdrawal rules, platform fees, and understand this is a sweepstakes entertainment platform with portfolio simulation only.
                  </Label>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(7)} 
                    disabled={!termsAgreed}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              <WelcomeLogin />
            )}
          </CardContent>
        </Card>
      </main>
      
      <footer className="py-4 border-t">
        <div className="container text-center text-xs md:text-sm text-muted-foreground">
          © 2025 Ibeni. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
