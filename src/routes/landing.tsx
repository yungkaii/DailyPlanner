import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { SocialTrustSection } from '../components/landing/SocialTrustSection';
import { FeatureSection } from '../components/landing/FeatureSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { DashboardPreview } from '../components/landing/DashboardPreview';
import { CTASection } from '../components/landing/CTASection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { AuthModal } from '../components/auth/AuthModal';

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  useEffect(() => {
    if (user) {
      navigate({ to: '/app', replace: true });
    }
  }, [user, navigate]);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20 selection:text-foreground">
      {/* Top Navbar */}
      <LandingNavbar onOpenAuth={handleOpenAuth} />

      {/* Main Landing Flow */}
      <main className="flex-1">
        <HeroSection onOpenAuth={handleOpenAuth} />
        <SocialTrustSection />
        <FeatureSection />
        <HowItWorks />
        <DashboardPreview onOpenAuth={handleOpenAuth} />
        <CTASection onOpenAuth={handleOpenAuth} />
      </main>

      {/* Footer */}
      <LandingFooter onOpenAuth={handleOpenAuth} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => navigate({ to: '/app' })}
      />
    </div>
  );
}
