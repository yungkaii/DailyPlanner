import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckSquare, Flame, Target, ArrowUpRight } from 'lucide-react';
import { RevealOnScroll } from '../ui/RevealOnScroll';

export function FeatureSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: t('landing.features.dailyPlanningTitle'),
      description: t('landing.features.dailyPlanningDesc'),
      color: 'border-primary/30',
      tag: 'Timeline & Calendar',
      details: [
        'Time-blocked schedule with live "Active Now" indicator',
        'Day, Week, and Month calendar perspectives',
        'Recurring blocks for routines and deep work',
      ],
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-[#4A7B9D]" />,
      title: t('landing.features.tasksTitle'),
      description: t('landing.features.tasksDesc'),
      color: 'border-[#4A7B9D]/30',
      tag: 'Task Management',
      details: [
        'P1 to P4 priority hierarchy with due dates',
        'Link specific tasks directly to schedule blocks',
        'Filter by status, priority, and date quickly',
      ],
    },
    {
      icon: <Flame className="w-5 h-5 text-[#C05D3B]" />,
      title: t('landing.features.habitsTitle'),
      description: t('landing.features.habitsDesc'),
      color: 'border-[#C05D3B]/30',
      tag: 'Habit Rituals',
      details: [
        'Organize by morning, afternoon, or evening routines',
        'Unbroken streak counters & consistency metrics',
        'One-tap completion with zero friction',
      ],
    },
    {
      icon: <Target className="w-5 h-5 text-[#7B6B8A]" />,
      title: t('landing.features.goalsTitle'),
      description: t('landing.features.goalsDesc'),
      color: 'border-[#7B6B8A]/30',
      tag: 'Goals & Reflection',
      details: [
        'Quarterly and annual strategic milestones',
        'Progress percentage tracking with target deadlines',
        'Productivity momentum stats computed automatically',
      ],
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <RevealOnScroll direction="down">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              {t('landing.features.tag')}
            </span>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={100}>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground mt-2 mb-4">
              {t('landing.features.title')}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={200}>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('landing.features.subtitle')}
            </p>
          </RevealOnScroll>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => (
            <RevealOnScroll
              key={idx}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              delay={idx * 100}
              className="rounded-xl border border-border bg-card p-6 sm:p-7 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-background border border-border">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                  {feat.description}
                </p>

                {/* Sub-features / bullets */}
                <ul className="space-y-2 pt-4 border-t border-border/70 text-xs text-foreground">
                  {feat.details.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
