import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  RotateCw,
  LayoutDashboard,
  Clock,
  CalendarDays,
  CheckSquare,
  Flame,
  Target,
  Search,
  Plus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { RevealOnScroll } from '../ui/RevealOnScroll';

interface DashboardPreviewProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export function DashboardPreview({ onOpenAuth }: DashboardPreviewProps) {
  const { t } = useTranslation();

  return (
    <section id="preview" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <RevealOnScroll direction="down">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              {t('landing.preview.tag')}
            </span>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={100}>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground mt-2 mb-4">
              {t('landing.preview.title')}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={200}>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('landing.preview.subtitle')}
            </p>
          </RevealOnScroll>
        </div>

        {/* Browser Mockup Window */}
        <RevealOnScroll direction="up" delay={300} className="max-w-5xl mx-auto">
          <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Browser Top Window Bar */}
            <div className="h-10 bg-muted/60 border-b border-border px-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#BF4040]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#B8860B]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#5E8C61]/80 inline-block" />
              </div>

              {/* Address bar */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border text-[11px] font-mono text-muted-foreground w-64 sm:w-80 justify-center">
                <Lock className="w-3 h-3 text-[#5E8C61]" />
                <span className="text-foreground">routineup.app</span>
                <span className="text-muted-foreground">/app</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <RotateCw className="w-3 h-3" />
              </div>
            </div>

            {/* Simulated RoutineUp App Interface */}
            <div className="flex flex-col lg:flex-row min-h-[460px] bg-background text-foreground text-xs select-none">
              {/* Mini App Sidebar */}
              <div className="hidden lg:flex flex-col w-48 border-r border-border bg-card/60 p-3 shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-1.5 mb-3 font-serif font-semibold text-sm">
                  RoutineUp
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-primary/10 text-primary font-medium">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Calendar</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Habits</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <Target className="w-3.5 h-3.5" />
                    <span>Goals</span>
                  </div>
                </div>

                {/* Sidebar mini progress */}
                <div className="mt-auto pt-3 border-t border-border">
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                    <span>Momentum</span>
                    <span className="text-primary font-bold">68%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              {/* Main Content Pane */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header bar */}
                <div className="h-11 border-b border-border bg-card/40 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="font-semibold text-foreground">09:42 AM</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground hidden sm:inline">Monday, Sep 14</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-muted/40 text-[10px] text-muted-foreground">
                      <Search className="w-3 h-3" />
                      <span>Search...</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[9px]">
                      A
                    </div>
                  </div>
                </div>

                {/* Dashboard Inner Grid */}
                <div className="p-4 sm:p-5 space-y-4 overflow-hidden">
                  {/* Hero card */}
                  <div className="p-3.5 rounded-lg border border-border bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-foreground">
                          Good morning, Alex
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          You're on track for your deep work sessions today.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">
                        Day 14 in Flow
                      </span>
                    </div>
                  </div>

                  {/* Two columns: Schedule & Tasks/Habits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Left: Next up & timeline */}
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-mono text-primary font-bold uppercase tracking-wider">
                            Active Now
                          </span>
                          <span className="font-mono text-primary">09:00 - 11:30</span>
                        </div>
                        <p className="font-medium text-xs text-foreground">Product Architecture & Schemas</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Focus time · 72m left</p>
                      </div>

                      <div className="p-3 rounded-lg border border-border bg-card">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
                          Upcoming Schedule
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] opacity-60">
                            <span className="line-through">Morning Planning & Coffee</span>
                            <span className="font-mono text-[10px]">08:00</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-foreground">Engineering Sync</span>
                            <span className="font-mono text-[10px] text-muted-foreground">13:30</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-foreground">Writing & Documentation</span>
                            <span className="font-mono text-[10px] text-muted-foreground">15:00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Tasks & Habits */}
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase mb-2">
                          <span>Quick Tasks</span>
                          <span>2 pending</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground line-through">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8C61] shrink-0" />
                            <span>Prepare release checklist</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-foreground">
                            <div className="w-3.5 h-3.5 rounded border border-primary shrink-0" />
                            <span className="truncate">Submit sprint retrospective note</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-foreground">
                            <div className="w-3.5 h-3.5 rounded border border-primary shrink-0" />
                            <span className="truncate">Update landing page design copy</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-border bg-card">
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase mb-2">
                          <span>Habit Streaks</span>
                          <span className="text-[#C05D3B] font-bold">🔥 3 Active</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          <div className="p-1.5 rounded bg-background border border-border">
                            <span className="block text-[10px] text-muted-foreground truncate">Hydration</span>
                            <span className="font-mono font-bold text-primary text-[11px]">14d</span>
                          </div>
                          <div className="p-1.5 rounded bg-background border border-border">
                            <span className="block text-[10px] text-muted-foreground truncate">10k Steps</span>
                            <span className="font-mono font-bold text-primary text-[11px]">8d</span>
                          </div>
                          <div className="p-1.5 rounded bg-background border border-border">
                            <span className="block text-[10px] text-muted-foreground truncate">Reading</span>
                            <span className="font-mono font-bold text-primary text-[11px]">21d</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Interactive Bar */}
            <div className="p-4 sm:p-5 bg-card border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium text-foreground">
                  Experience the full planner live right in your browser.
                </p>
                <p className="text-[11px] text-muted-foreground">
                  No account required to try the local sandbox.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-initial"
                  onClick={() => onOpenAuth('signin')}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />}
                >
                  {t('landing.nav.signIn')}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 sm:flex-initial"
                  onClick={() => onOpenAuth('signup')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
                >
                  {t('landing.hero.getStarted')}
                </Button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
