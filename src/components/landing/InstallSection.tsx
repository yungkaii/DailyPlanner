import React from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff, Zap, Smartphone, ShieldCheck } from 'lucide-react';
import { InstallButton } from '../pwa/InstallButton';
import { RevealOnScroll } from '../ui/RevealOnScroll';

const FEATURES = [
  {
    key: 'offline',
    icon: WifiOff,
    className: 'text-primary',
  },
  {
    key: 'fast',
    icon: Zap,
    className: 'text-[#B8860B]',
  },
  {
    key: 'homeScreen',
    icon: Smartphone,
    className: 'text-[#4A7B9D]',
  },
  {
    key: 'noTrack',
    icon: ShieldCheck,
    className: 'text-[#5E8C61]',
  },
] as const;

export function InstallSection() {
  const { t } = useTranslation();

  return (
    <section id="install" className="py-16 md:py-20 border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Copy */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-xs text-foreground mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-medium">{t('pwa.tag')}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground leading-[1.15] mb-3">
                {t('pwa.title')}
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto md:mx-0">
                {t('pwa.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <InstallButton size="lg" showHint />
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map(({ key, icon: Icon, className }) => (
                <div
                  key={key}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background"
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${className}`} />
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-0.5">
                      {t(`pwa.features.${key}.title`)}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(`pwa.features.${key}.desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}