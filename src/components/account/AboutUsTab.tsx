
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  TrendingUp, 
  Gift, 
  Shield, 
  Clock, 
  DollarSign, 
  AlertCircle,
  Info,
  Users,
  Target
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AboutUsTab = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">About ibeni</h1>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
          We're revolutionizing sports entertainment by ending the cycle of throwing money away on traditional betting. 
          With ibeni, you know your fixed costs upfront while still getting the thrill of winning - and when you don't win, 
          you see what you should have been doing instead of gambling.
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Our Philosophy:</strong> We know you can't simply stop enjoying sports betting - but we can make it a less harmful, more educational experience.
        </AlertDescription>
      </Alert>

      {/* Hero Section - The Problem We Solve */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-6 w-6" />
            The Problem with Traditional Sports Betting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-red-700">
          <p className="text-base">
            Traditional sports betting is designed to take your money. You place a bet, and if you lose, 
            that money is simply gone forever. Over time, most people lose more than they win, 
            essentially throwing money away for temporary entertainment.
          </p>
          <div className="bg-white/60 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">The Traditional Betting Cycle:</h4>
            <ul className="text-xs md:text-sm space-y-1">
              <li>• Bet $100 → Lose → $100 completely gone</li>
              <li>• Bet another $100 → Lose → Another $100 gone</li>
              <li>• Repeat until your bankroll is depleted</li>
              <li>• <strong>Result: Money thrown away with nothing to show for it</strong></li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* The ibeni Solution */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Target className="h-6 w-6" />
            The ibeni Solution: Fixed Costs, Better Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-700">
          <p className="text-base">
            At ibeni, we've reimagined sports entertainment with transparency and education at the core. 
            You know exactly what your costs are upfront, and when you don't win, 90% of your losses 
            are redirected into a portfolio simulation to show you what smart investing looks like.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/60 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Fixed Cost Structure
              </h4>
              <ul className="text-xs md:text-sm space-y-1">
                <li>• 10% fee on winnings when you win</li>
                <li>• 10% fee on bet amount when you lose</li>
                <li>• Transparent pricing you can plan around</li>
                <li>• Budget with confidence</li>
              </ul>
            </div>
            
            <div className="bg-white/60 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Smart Loss Recovery
              </h4>
              <ul className="text-xs md:text-sm space-y-1">
                <li>• 90% of losses go to portfolio simulation</li>
                <li>• Learn what investing looks like</li>
                <li>• Redeemable with withdrawal fees</li>
                <li>• Turn losses into learning opportunities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How ibeni Works */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              1. Make Your Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs md:text-sm text-muted-foreground">
              Choose your sports events and make predictions just like traditional betting, 
              but with complete cost transparency.
            </p>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-xs"><strong>Win Example:</strong> Bet $100, win $200 total</p>
              <p className="text-xs">→ 10% fee on $100 winnings = $10 fee</p>
              <p className="text-xs"><strong>Lose Example:</strong> Bet $100, lose</p>
              <p className="text-xs">→ 10% fee on $100 bet = $10 fee, $90 to portfolio</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              2. Win or Learn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs md:text-sm text-muted-foreground">
              If you win, you get Growth Cash. If you lose, 90% goes to your portfolio simulation 
              to show you what investing those losses would have looked like.
            </p>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-xs"><strong>Win:</strong> Get Growth Cash rewards</p>
              <p className="text-xs"><strong>Lose:</strong> $90 goes to portfolio simulation</p>
              <p className="text-xs">→ Educational value instead of total loss</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              3. Withdraw When Ready
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs md:text-sm text-muted-foreground">
              Your portfolio simulation is redeemable with withdrawal fees, giving you something 
              tangible instead of just lost money.
            </p>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-xs"><strong>Growth Cash winnings:</strong> Subscribers after 3mo</p>
              <p className="text-xs"><strong>Portfolio losses:</strong> All members with fees</p>
              <p className="text-xs">→ Your "losses" become recoverable value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* The Psychology Behind ibeni */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Users className="h-6 w-6" />
            Why We Built ibeni This Way
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-purple-700">
          <p className="text-base">
            We understand that telling someone to "just stop gambling" doesn't work. The thrill of sports predictions, 
            the excitement of potentially winning big - these are natural human desires that won't simply disappear.
          </p>
          <p className="text-base">
            Instead of fighting these impulses, we've created a system that satisfies them while providing educational value 
            and reducing financial harm. You still get the excitement of winning, but your losses become learning opportunities 
            rather than money thrown into the void.
          </p>
          <div className="bg-white/60 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Our Core Beliefs:</h4>
            <ul className="text-xs md:text-sm space-y-1">
              <li>• Harm reduction is better than prohibition</li>
              <li>• Education should come from experience</li>
              <li>• Transparency builds trust</li>
              <li>• Entertainment can have lasting value</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Traditional Betting vs. ibeni</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600 text-center">Traditional Betting</h4>
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <ul className="text-xs md:text-sm space-y-2 text-red-700">
                  <li>• Hidden fees and juice</li>
                  <li>• Losses are completely gone</li>
                  <li>• No educational value</li>
                  <li>• Designed to extract maximum money</li>
                  <li>• No transparency in costs</li>
                  <li>• Win or lose - nothing to show for losses</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600 text-center">ibeni</h4>
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <ul className="text-xs md:text-sm space-y-2 text-green-700">
                  <li>• 10% fee on winnings (wins) or bet amount (losses)</li>
                  <li>• 90% of losses become portfolio value</li>
                  <li>• Learn about investing through simulation</li>
                  <li>• Designed for education and harm reduction</li>
                  <li>• Complete cost transparency</li>
                  <li>• Losses become redeemable value</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> ibeni operates as a sweepstakes entertainment platform focused on education and harm reduction. 
          Portfolio simulations are for educational purposes and do not constitute actual investment advice or guaranteed returns. 
          All fees are transparent and non-refundable.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center gap-4 pt-6">
        <Button onClick={() => navigate('/terms')} variant="outline">
          View Terms & Conditions
        </Button>
        <Button onClick={() => navigate('/subscription')}>
          Start Your Journey
        </Button>
      </div>
    </div>
  );
};

export default AboutUsTab;
