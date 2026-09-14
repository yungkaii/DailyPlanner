import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Compass, TrendingUp } from 'lucide-react';
import { RevealOnScroll } from '../ui/RevealOnScroll';

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      title: t('landing.howItWorks.step1Title'),
      desc: t('landing.howItWorks.step1Desc'),
      icon: <Calendar className="w-5 h-5 text-primary" />,
      detail: 'Begin each morning by time-blocking your top commitments and linking essential tasks.',
    },
    {
      number: '02',
      title: t('landing.howItWorks.step2Title'),
      desc: t('landing.howItWorks.step2Desc'),
      icon: <Compass className="w-5 h-5 text-[#4A7B9D]" />,
      detail: 'Work through your day block-by-block with live countdowns and zero context switching.',
    },
    {
      number: '03',
      title: t('landing.howItWorks.step3Title'),
      desc: t('landing.howItWorks.step3Desc'),
      icon: <TrendingUp className="w-5 h-5 text-[#5E8C61]" />,
      detail: 'Watch habit streaks grow and quarterly milestones become completed realities.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <RevealOnScroll direction="down">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              {t('landing.howItWorks.tag')}
            </span>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={100}>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground mt-2 mb-4">
              {t('landing.howItWorks.title')}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={200}>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('landing.howItWorks.subtitle')}
            </p>
          </RevealOnScroll>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => (
            <RevealOnScroll
              key={idx}
              direction="up"
              delay={idx * 150}
              className="relative p-6 sm:p-7 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Step number badge & icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-primary/80">
                    {step.number}
                  </span>
                  <div className="p-2 rounded-lg bg-background border border-border">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-foreground mb-3 leading-snug">
                  {step.desc}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
