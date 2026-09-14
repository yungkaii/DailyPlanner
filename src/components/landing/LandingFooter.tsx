import React from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sun, Moon, Globe, ShieldCheck } from 'lucide-react';

interface LandingFooterProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export function LandingFooter({ onOpenAuth }: LandingFooterProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <footer className="border-t border-border bg-card text-foreground py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-border">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-xl font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                RoutineUp
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {t('landing.footer.desc')}
            </p>

            {/* Language & Theme Controls in Footer */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="uppercase font-semibold text-[11px]">{language}</span>
              </button>

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-1.5 rounded border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-[#B8860B]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              {t('landing.footer.product')}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  {t('landing.footer.features')}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  {t('landing.footer.howItWorks')}
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-foreground transition-colors">
                  {t('landing.footer.overview')}
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
              {t('landing.footer.account')}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  {t('landing.footer.signIn')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  {t('landing.footer.createAccount')}
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Principles */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5E8C61]" />
              {t('landing.footer.privacy')}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('landing.footer.privacyDesc')}
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
          <p>© {new Date().getFullYear()} RoutineUp. {t('landing.footer.rights')}</p>
          <p className="text-[11px] text-muted-foreground/80">
            Developed By : Yukafii
          </p>
        </div>
      </div>
    </footer>
  );
}
