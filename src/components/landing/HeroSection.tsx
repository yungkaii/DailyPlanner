import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, CheckCircle2, Clock, Flame, CheckSquare, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { RevealOnScroll } from '../ui/RevealOnScroll';

interface HeroSectionProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Eyebrow Badge */}
          <RevealOnScroll direction="down" delay={100}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card shadow-xs text-xs text-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-medium">{t('landing.hero.tag')}</span>
            </div>
          </RevealOnScroll>

          {/* Headline */}
          <RevealOnScroll direction="up" delay={200}>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.15] mb-6">
              <span>{t('landing.hero.headlinePart1')} </span>
              <span className="text-primary italic font-serif block sm:inline">
                {t('landing.hero.headlinePart2')}
              </span>
            </h1>
          </RevealOnScroll>

          {/* Subheadline */}
          <RevealOnScroll direction="up" delay={300}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl font-sans">
              {t('landing.hero.subheadline')}
            </p>
          </RevealOnScroll>

          {/* Dual Action CTAs */}
          <RevealOnScroll direction="up" delay={400}>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-5">
              <Button
                size="lg"
                className="w-full sm:w-auto px-7 py-2.5 text-sm font-medium justify-center cursor-pointer shadow-sm"
                onClick={() => onOpenAuth('signup')}
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                {t('landing.hero.getStarted')}
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
          </RevealOnScroll>

          {/* Reassurance text */}
          <RevealOnScroll direction="up" delay={500}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Shield className="w-3.5 h-3.5 text-[#5E8C61]" />
              <span>{t('landing.hero.noCreditCard')}</span>
            </div>
          </RevealOnScroll>
        </div>

        {/* Hero Interactive Preview Card */}
        <RevealOnScroll direction="up" delay={600} className="mt-12 md:mt-16 max-w-4xl mx-auto">
          <div className="relative rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6 overflow-hidden">
            {/* Top ruled planner bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-serif text-sm font-semibold text-foreground">
                  Today's Flow Log
                </span>
                <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded border border-border">
                  09:42 AM
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-muted-foreground">Momentum:</span>
                <span className="font-semibold text-primary">68%</span>
                <div className="w-20 sm:w-28 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>

            {/* Grid preview: Schedule Block + Tasks + Habits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Focus Block */}
              <div className="p-3.5 rounded-lg border border-border bg-background flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      Active Block
                    </span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      In Progress
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-medium text-foreground mb-1">
                    Deep Work · Product Architecture
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Refining domain models, schedule timelines, and habit sync schemas.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>09:00 - 11:30</span>
                  <span>72m left</span>
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="p-3.5 rounded-lg border border-border bg-background">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <CheckSquare className="w-3.5 h-3.5 text-[#4A7B9D]" />
                    Today's Tasks
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">3 / 4</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs line-through text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8C61] shrink-0" />
                    <span className="truncate">Draft quarterly goals overview</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs line-through text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8C61] shrink-0" />
                    <span className="truncate">Morning 20-min mindful reading</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                    <div className="w-3.5 h-3.5 rounded border border-primary/50 shrink-0" />
                    <span className="truncate">Review pull request & audit log</span>
                  </div>
                </div>
              </div>

              {/* Habit Rituals */}
              <div className="p-3.5 rounded-lg border border-border bg-background">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Flame className="w-3.5 h-3.5 text-[#C05D3B]" />
                    Daily Habits
                  </span>
                  <span className="font-mono text-[11px] text-primary font-medium">12d Streak</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">Morning hydration</span>
                    <span className="text-[10px] font-mono text-[#5E8C61] bg-[#5E8C61]/10 px-1.5 py-0.2 rounded">
                      Done
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">10,000 steps walk</span>
                    <span className="text-[10px] font-mono text-[#5E8C61] bg-[#5E8C61]/10 px-1.5 py-0.2 rounded">
                      Done
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">Evening digital shutdown</span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                      21:00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
