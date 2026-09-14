import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { RevealOnScroll } from '../ui/RevealOnScroll';

interface CTASectionProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export function CTASection({ onOpenAuth }: CTASectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-card/40 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <RevealOnScroll direction="up">
          <div className="p-8 sm:p-12 rounded-2xl border border-primary/20 bg-background shadow-xs relative overflow-hidden">
            {/* Ambient accent dot */}
            <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-4" />

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground mb-4">
              {t('landing.cta.title')}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 font-sans">
              {t('landing.cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto px-7 py-2.5 text-sm font-medium justify-center cursor-pointer shadow-sm"
                onClick={() => onOpenAuth('signup')}
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                {t('landing.cta.getStarted')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium justify-center cursor-pointer border-border hover:bg-muted"
                onClick={() => onOpenAuth('signin')}
                leftIcon={<Sparkles className="w-4 h-4 mr-1 text-primary" />}
              >
                {t('landing.nav.signIn')}
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
