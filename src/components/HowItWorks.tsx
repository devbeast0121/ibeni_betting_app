import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, AlertCircle, Info, CheckCircle, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from './ui/alert';

const HowItWorks = () => {
  const navigate = useNavigate();
  
  const scenarios = [
    {
      title: "When You Win Your Predictions",
      description: "Your sports knowledge pays off with real rewards",
      details: [
        "Your prediction skills earn you real money",
        "Growth Cash balance increases with correct bets", 
        "Build confidence and wealth at the same time",
        "10% platform fee on winnings only when you win"
      ],
      icon: CheckCircle,
      gradient: "from-green-50 to-emerald-100",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      bgAccent: "bg-green-500"
    },
    {
      title: "When Predictions Don't Win", 
      description: "Your money becomes a smart investment instead",
      details: [
        "No total loss - money becomes an investment",
        "Build long-term wealth even from incorrect bets",
        "Every Growth Cash bet becomes a wealth-building opportunity",
        "10% platform fee on bet amount, 90% to portfolio"
      ],
      icon: TrendingUp,
      gradient: "from-blue-50 to-indigo-100",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      bgAccent: "bg-blue-500"
    },
    {
      title: "Transparent Platform Fee",
      description: "Crystal clear Growth Cash pricing structure",
      details: [
        "10% fee on winnings when you win, 10% on bet amount when you lose",
        "Fee supports platform operations and development", 
        "No hidden costs or surprise charges",
        "Transparent pricing lets you plan your strategy"
      ],
      icon: DollarSign,
      gradient: "from-purple-50 to-violet-100",
      borderColor: "border-purple-200",
      iconColor: "text-purple-600",
      bgAccent: "bg-purple-500"
    },
    {
      title: "Long-term Wealth Building",
      description: "Your consistent Growth Cash strategy over time",
      details: [
        "Win bets = Growth Cash (subscribers: 3mo wait to withdraw, non-subscribers: no withdrawal)",
        "Lose bets = Portfolio simulation (withdrawable with fees)",
        "Win-win: winnings or withdrawable portfolio value",
        "Perfect blend of skill-building and investing"
      ],
      icon: Clock,
      gradient: "from-orange-50 to-amber-100",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      bgAccent: "bg-orange-500"
    }
  ];
  
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">How Growth Cash Works at ibeni</h2>
        <p className="text-xl text-muted-foreground mb-6">
          Follow these real scenarios to see exactly what happens with your Growth Cash bets
        </p>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <p className="flex items-center justify-center gap-3 font-medium text-green-800 text-lg">
            <DollarSign className="h-6 w-6" />
            Every Growth Cash bet is a win - either immediate profit or long-term investment
          </p>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50 max-w-4xl mx-auto">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>WITHDRAWAL RULES:</strong> Growth Cash winnings may be withdrawn by subscribers after a 3-month waiting period. Non-subscribers cannot withdraw Growth Cash winnings. Portfolio losses are withdrawable by all members with fees: 5% after one year, 50% before one year.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {scenarios.map((scenario, index) => (
          <Card key={index} className={`bg-gradient-to-br ${scenario.gradient} dark:from-gray-950/50 dark:to-gray-900/30 ${scenario.borderColor} dark:border-gray-700 transition-all hover:shadow-lg`}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${scenario.bgAccent} text-white rounded-lg shadow-sm`}>
                  <scenario.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {scenario.title}
                  </CardTitle>
                  <p className={`text-xs md:text-sm font-medium ${scenario.iconColor} dark:opacity-80`}>
                    {scenario.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="space-y-3">
                  {scenario.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`p-1.5 ${scenario.bgAccent}/10 rounded-lg`}>
                        <ArrowRight className={`h-4 w-4 ${scenario.iconColor}`} />
                      </div>
                      <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">The Growth Cash Advantage</h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              With Growth Cash at ibeni, you never just "lose" money. <strong>Every bet is either immediate profit or long-term investment.</strong> 
              You're always building wealth - whether that's celebrating wins or growing your portfolio.
            </p>
            <div className="bg-white/60 p-4 rounded-lg mb-6">
              <p className="text-xs md:text-sm text-gray-600 mb-2"><strong>Remember:</strong> 10% fee on winnings when you win, 10% fee on bet amount when you lose</p>
              <p className="text-xs text-gray-500">This transparent fee structure keeps our platform running and your investment opportunities flowing</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/subscription')} size="lg" className="px-8">
                Start With Growth Cash
              </Button>
              <Button onClick={() => navigate('/terms')} variant="outline" size="lg" className="px-8">
                Read Full Terms
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert className="border-amber-200 bg-amber-50 max-w-4xl mx-auto">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>NO PURCHASE NECESSARY.</strong> Void where prohibited. Free alternative method of entry available - see <Button variant="link" className="p-0 h-auto text-amber-800 underline" onClick={() => navigate('/terms#sweep')}>Sweepstakes Rules</Button> for details.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default HowItWorks;