import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Lightbulb, TrendingUp, Calendar, ArrowRight, Crown, Shield, Gift, Clock, CheckCircle, Lock, DollarSign, Users, Star, Target, Trophy, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HypotheticalInvestmentComparison from './HypotheticalInvestmentComparison';

const DailyInvestingLearning = () => {
  const navigate = useNavigate();
  
  // Get current date string for daily rotation (resets at midnight)
  const getCurrentDateKey = () => {
    const now = new Date();
    return now.toDateString(); // Returns format like "Mon Oct 30 2023"
  };

  // Convert date string to number for array indexing
  const getDateBasedIndex = (dateString: string) => {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const investingFacts = [
    {
      title: "The Power of Compound Interest",
      fact: "Albert Einstein allegedly called compound interest 'the eighth wonder of the world.' When you earn returns on your initial investment plus previous returns, your money grows exponentially over time.",
      category: "Fundamentals",
      icon: TrendingUp,
      visual: "📈"
    },
    {
      title: "Dollar-Cost Averaging",
      fact: "Investing the same amount regularly, regardless of market conditions, can reduce the impact of volatility. You buy more shares when prices are low and fewer when prices are high.",
      category: "Strategy", 
      icon: Calendar,
      visual: "📅"
    },
    {
      title: "Diversification Benefits",
      fact: "Don't put all your eggs in one basket. Spreading investments across different asset classes, sectors, and regions can help reduce risk while maintaining growth potential.",
      category: "Risk Management",
      icon: BookOpen,
      visual: "🛡️"
    },
    {
      title: "Time in Market vs. Timing the Market",
      fact: "Studies show that staying invested for longer periods typically outperforms trying to predict market highs and lows. Time is often your greatest investment ally.",
      category: "Strategy",
      icon: TrendingUp,
      visual: "⏰"
    },
    {
      title: "The 72 Rule",
      fact: "Divide 72 by your annual return rate to estimate how long it takes to double your investment. At 8% annual returns, your money doubles approximately every 9 years.",
      category: "Fundamentals",
      icon: Lightbulb,
      visual: "💡"
    },
    {
      title: "Market Volatility is Normal",
      fact: "The S&P 500 has experienced a correction (10% decline) about once every 1.5 years on average, but has still delivered positive returns over decades.",
      category: "Risk Management",
      icon: BookOpen,
      visual: "📊"
    },
    {
      title: "Asset Allocation Matters",
      fact: "Studies show that asset allocation (how you divide your money between stocks, bonds, etc.) is responsible for about 90% of your portfolio's performance variability.",
      category: "Strategy",
      icon: Target,
      visual: "🎯"
    },
    {
      title: "The Cost of Waiting",
      fact: "Starting to invest at 25 vs. 35 can mean hundreds of thousands more at retirement, even with the same total contributions. The earlier you start, the more time works for you.",
      category: "Fundamentals",
      icon: Clock,
      visual: "⏳"
    },
    {
      title: "Inflation's Silent Impact",
      fact: "Money sitting in low-yield savings accounts loses purchasing power over time. At 3% inflation, $1000 today will only buy about $744 worth of goods in 10 years.",
      category: "Economics",
      icon: DollarSign,
      visual: "📉"
    },
    {
      title: "Market Cycles Are Inevitable",
      fact: "Bull and bear markets are natural parts of economic cycles. Since 1942, the average bull market has lasted 4.4 years with gains of 154%. Bear markets average 1.3 years with losses of 32%.",
      category: "Psychology",
      icon: TrendingUp,
      visual: "🔄"
    },
    {
      title: "Index Fund Efficiency",
      fact: "Over 90% of actively managed funds fail to beat their benchmark index over 15-year periods. Low-cost index funds often outperform expensive actively managed funds.",
      category: "Strategy",
      icon: Trophy,
      visual: "🏆"
    },
    {
      title: "Rebalancing Your Portfolio",
      fact: "Regularly rebalancing your portfolio back to target allocations forces you to sell high-performing assets and buy underperforming ones - a disciplined way to buy low and sell high.",
      category: "Strategy",
      icon: Shield,
      visual: "⚖️"
    },
    {
      title: "The Danger of Emotional Investing",
      fact: "The average investor earns about 2-3% less annually than the market because they buy high during euphoria and sell low during panic. Staying disciplined is crucial.",
      category: "Psychology",
      icon: AlertTriangle,
      visual: "😰"
    },
    {
      title: "Tax-Advantaged Accounts",
      fact: "401(k)s and IRAs can significantly boost your long-term wealth. A $6,000 annual IRA contribution growing at 7% becomes over $1.3 million in 40 years with tax advantages.",
      category: "Strategy",
      icon: Gift,
      visual: "🎁"
    },
    {
      title: "Emergency Fund First",
      fact: "Before investing, build an emergency fund covering 3-6 months of expenses. This prevents you from having to sell investments during market downturns.",
      category: "Fundamentals",
      icon: Shield,
      visual: "🛡️"
    }
  ];

  const learningTips = [
    {
      title: "Risk vs. Return",
      description: "Higher potential returns usually come with higher risk. Balancing your portfolio between safe and growth assets is key to long-term success.",
      icon: TrendingUp,
      color: "amber"
    },
    {
      title: "Long-term Thinking", 
      description: "The stock market can be volatile short-term, but historically trends upward over decades. Patience and consistency often beat trying to time the market.",
      icon: Calendar,
      color: "green"
    },
    {
      title: "Start Early",
      description: "Time is your most powerful investing tool. Starting young allows compound interest to work its magic over decades.",
      icon: Clock,
      color: "blue"
    },
    {
      title: "Goal-Based Investing",
      description: "Different goals require different strategies. Retirement needs growth over decades, while a house down payment in 2 years needs stability.",
      icon: Target,
      color: "indigo"
    },
    {
      title: "Stay Educated",
      description: "The more you understand about investing principles, the better decisions you'll make. Knowledge is your best defense against poor choices.",
      icon: BookOpen,
      color: "purple"
    },
    {
      title: "Avoid FOMO",
      description: "Fear of missing out leads to poor investment decisions. Stick to your plan instead of chasing the latest hot trend.",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Regular Contributions",
      description: "Consistent investing, even small amounts, often beats trying to make large investments at 'perfect' times.",
      icon: Calendar,
      color: "green"
    }
  ];

  const marketPsychologyFacts = [
    {
      title: "Loss Aversion",
      description: "People feel the pain of losing money twice as strongly as the pleasure of gaining it. This leads to holding losing investments too long.",
      icon: Shield
    },
    {
      title: "Confirmation Bias", 
      description: "We seek information that confirms our existing beliefs while ignoring contradictory evidence. This can lead to poor investment decisions.",
      icon: BookOpen
    },
    {
      title: "Herd Mentality",
      description: "Following what everyone else is doing without independent analysis often leads to buying high and selling low.",
      icon: Users
    },
    {
      title: "Overconfidence",
      description: "Success can breed overconfidence, leading to taking excessive risks or trading too frequently, which often hurts returns.",
      icon: Trophy
    },
    {
      title: "Anchoring Bias",
      description: "Focusing too heavily on one piece of information (like a stock's 52-week high) can cloud judgment about its current value.",
      icon: Target
    }
  ];

  const budgetingTips = [
    {
      title: "50/30/20 Rule",
      description: "Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment. This simple framework helps maintain financial balance.",
      icon: Target,
      color: "emerald"
    },
    {
      title: "Track Every Dollar",
      description: "Use budgeting apps or spreadsheets to monitor where your money goes. Awareness is the first step to better financial control.",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Pay Yourself First",
      description: "Set up automatic transfers to savings and investments before paying other expenses. This ensures you prioritize your financial future.",
      icon: Gift,
      color: "blue"
    },
    {
      title: "Emergency Fund Priority",
      description: "Build 3-6 months of expenses in a high-yield savings account before aggressive investing. This prevents debt during unexpected events.",
      icon: Shield,
      color: "amber"
    },
    {
      title: "Avoid Lifestyle Inflation",
      description: "When income increases, resist the urge to immediately upgrade your lifestyle. Channel extra income toward savings and investments instead.",
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Use the Envelope Method",
      description: "Allocate cash to different spending categories in separate envelopes. When the envelope is empty, you're done spending in that category.",
      icon: Calendar,
      color: "orange"
    },
    {
      title: "Review Monthly",
      description: "Spend 30 minutes each month reviewing your budget vs. actual spending. Adjust categories based on what you learned.",
      icon: BookOpen,
      color: "indigo"
    }
  ];

  // Get current date for daily rotation (resets at midnight)
  const currentDateKey = getCurrentDateKey();
  const dateIndex = getDateBasedIndex(currentDateKey);
  
  // Cycle through content based on current date for daily feed
  const currentFactIndex = dateIndex % investingFacts.length;
  const todaysFact = investingFacts[currentFactIndex];
  
  // Rotate learning tips based on date with offset
  const currentTipIndex = (dateIndex + 3) % learningTips.length;
  const todaysTip = learningTips[currentTipIndex];
  
  // Rotate psychology fact with different offset
  const currentPsychIndex = (dateIndex + 7) % marketPsychologyFacts.length;
  const todaysPsychology = marketPsychologyFacts[currentPsychIndex];
  
  // Rotate budgeting tip with another offset
  const currentBudgetIndex = (dateIndex + 11) % budgetingTips.length;
  const todaysBudgetTip = budgetingTips[currentBudgetIndex];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fundamentals': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Strategy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Risk Management': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'Economics': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Psychology': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Hypothetical Investment Comparison - at the top */}
      <HypotheticalInvestmentComparison />
      {/* Daily Learning Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 text-white rounded-lg shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Today's Investment Insight
              </CardTitle>
              <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">{formatDate()}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getCategoryColor(todaysFact.category)}>
              {todaysFact.category}
            </Badge>
            <span className="text-3xl">{todaysFact.visual}</span>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <todaysFact.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{todaysFact.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{todaysFact.fact}</p>
              </div>
            </div>
          </div>
          
        </CardContent>
      </Card>

      {/* Additional Learning Resources */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/50 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 text-white rounded-lg shadow-sm">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Quick Learning Tips
              </CardTitle>
              <p className="text-xs md:text-sm text-purple-600 dark:text-purple-400 font-medium">
                Essential concepts for portfolio simulation success
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className={`p-2 bg-${todaysTip.color}-100 dark:bg-${todaysTip.color}-900/50 rounded-lg`}>
                <todaysTip.icon className={`h-5 w-5 text-${todaysTip.color}-600 dark:text-${todaysTip.color}-400`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{todaysTip.title}</h4>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{todaysTip.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Psychology Section */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/50 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 text-white rounded-lg shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Psychology of Markets
              </CardTitle>
              <p className="text-xs md:text-sm text-orange-600 dark:text-orange-400 font-medium">
                Understanding emotions and market behavior
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <todaysPsychology.icon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{todaysPsychology.title}</h4>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{todaysPsychology.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-400/10 dark:to-red-400/10 rounded-lg p-4 border border-orange-200/50 dark:border-orange-700/50">
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs md:text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">Pro Tip</p>
                <p className="text-xs md:text-sm text-orange-700 dark:text-orange-300">
                  Create rules for your investing decisions before emotions kick in. Set target percentages for different asset classes and stick to them regardless of market noise.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Budgeting Tips Section */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 text-white rounded-lg shadow-sm">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Daily Budgeting Tip
              </CardTitle>
              <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">
                Build strong financial foundations
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className={`p-2 bg-${todaysBudgetTip.color}-100 dark:bg-${todaysBudgetTip.color}-900/50 rounded-lg`}>
                <todaysBudgetTip.icon className={`h-5 w-5 text-${todaysBudgetTip.color}-600 dark:text-${todaysBudgetTip.color}-400`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{todaysBudgetTip.title}</h4>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{todaysBudgetTip.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10 rounded-lg p-4 border border-green-200/50 dark:border-green-700/50">
            <div className="flex items-start gap-3">
              <Gift className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs md:text-sm font-medium text-green-800 dark:text-green-200 mb-1">Remember</p>
                <p className="text-xs md:text-sm text-green-700 dark:text-green-300">
                  Good budgeting habits create the foundation for successful investing. Master your spending before focusing on portfolio growth.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyInvestingLearning;