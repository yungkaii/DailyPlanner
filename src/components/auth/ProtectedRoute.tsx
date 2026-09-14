import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            RoutineUp
          </span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
        </div>
        <p className="text-xs text-muted-foreground font-mono">Loading workspace...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
