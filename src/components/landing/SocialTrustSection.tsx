import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Flame, Target, Clock } from 'lucide-react';
import { RevealOnScroll } from '../ui/RevealOnScroll';

export function SocialTrustSection() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: t('landing.social.statSchedule'),
      subtitle: t('landing.social.statScheduleSub'),
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-[#4A7B9D]" />,
      title: t('landing.social.statTasks'),
      subtitle: t('landing.social.statTasksSub'),
    },
    {
      icon: <Flame className="w-5 h-5 text-[#5E8C61]" />,
      title: t('landing.social.statHabits'),
      subtitle: t('landing.social.statHabitsSub'),
    },
    {
      icon: <Target className="w-5 h-5 text-[#7B6B8A]" />,
      title: t('landing.social.statGoals'),
      subtitle: t('landing.social.statGoalsSub'),
    },
  ];

  return (
    <section className="border-y border-border bg-card/40 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up">
          <p className="text-center font-serif text-sm text-muted-foreground mb-8">
            {t('landing.social.title')}
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, index) => (
            <RevealOnScroll
              key={index}
              direction="up"
              delay={index * 100}
              className="flex items-start gap-3.5 p-3 rounded-lg hover:bg-card transition-colors"
            >
              <div className="p-2 rounded-md bg-background border border-border shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
