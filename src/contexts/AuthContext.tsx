
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  checkSubscription: () => Promise<SubscriptionData>;
  subscriptionData: SubscriptionData;
  refreshSubscription: () => Promise<void>;
  isAdmin: boolean;
}

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
  });

  // Admin emails
  const adminEmails = ['sheradsky@gmail.com', 'ibenisportportfolio@gmail.com', 'demo@example.com'];
  
  // Check if current user is admin
  const isAdmin = user ? adminEmails.includes(user.email || '') : false;

  const checkSubscription = async (): Promise<SubscriptionData> => {
    if (!session) {
      return { subscribed: false, subscription_tier: null, subscription_end: null };
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const subData = {
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
      };

      setSubscriptionData(subData);
      return subData;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return { subscribed: false, subscription_tier: null, subscription_end: null };
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check subscription after auth state changes
        if (session?.user) {
          setTimeout(() => {
            checkSubscription();
          }, 0);
        } else {
          setSubscriptionData({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          checkSubscription();
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('Signing out user');
    await supabase.auth.signOut();
  };

  const refreshSubscription = async (): Promise<void> => {
    await checkSubscription();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    checkSubscription,
    subscriptionData,
    refreshSubscription,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
