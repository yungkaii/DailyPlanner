import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';
import { DEMO_USER } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();
  
  // By default, if Supabase is not configured, we start in Demo mode with DEMO_USER
  const [isDemo, setIsDemo] = useState<boolean>(() => {
    if (!configured) return true;
    const stored = localStorage.getItem('dayflow_demo_mode');
    return stored === 'true';
  });

  useEffect(() => {
    if (!configured || isDemo) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    // Set up Supabase auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatar_url: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatar_url: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configured, isDemo]);

  const signIn = async (email: string, password: string) => {
    if (!configured) {
      return { error: 'Supabase is not configured yet. You can use Demo Mode in the meantime!' };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      setIsDemo(false);
      localStorage.setItem('dayflow_demo_mode', 'false');
      return {};
    } catch (err: any) {
      return { error: err.message || 'An error occurred during sign in' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!configured) {
      return { error: 'Supabase is not configured yet. Add VITE_SUPABASE_URL to your .env file to enable cloud authentication.' };
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) return { error: error.message };
      setIsDemo(false);
      localStorage.setItem('dayflow_demo_mode', 'false');
      return {};
    } catch (err: any) {
      return { error: err.message || 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    if (configured && !isDemo) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const enableDemoMode = () => {
    setIsDemo(true);
    localStorage.setItem('dayflow_demo_mode', 'true');
    setUser(DEMO_USER);
  };

  const disableDemoMode = () => {
    if (configured) {
      setIsDemo(false);
      localStorage.setItem('dayflow_demo_mode', 'false');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: configured,
        isDemo,
        signIn,
        signUp,
        signOut,
        enableDemoMode,
        disableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
