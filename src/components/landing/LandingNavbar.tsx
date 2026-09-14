import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Globe, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingNavbarProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export function LandingNavbar({ onOpenAuth }: LandingNavbarProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  const navLinks = [
    { href: '#features', label: t('landing.nav.features') },
    { href: '#how-it-works', label: t('landing.nav.howItWorks') },
    { href: '#preview', label: t('landing.nav.overview') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex flex-col">
            <span className="font-serif text-xl font-semibold tracking-tight text-foreground flex items-center gap-1.5">
              RoutineUp
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block transition-transform group-hover:scale-125" />
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block tracking-wide">
              {t('nav.brandSubtitle')}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Items */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono rounded-md border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="uppercase font-semibold text-[11px]">{language}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-md border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-[#B8860B]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-foreground" />
            )}
          </button>

          <div className="w-px h-4 bg-border mx-1" />

          {user ? (
            <Link to="/app">
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}>
                {t('landing.nav.openApp')}
              </Button>
            </Link>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenAuth('signin')}
              >
                {t('landing.nav.signIn')}
              </Button>
              <Button
                size="sm"
                onClick={() => onOpenAuth('signup')}
              >
                {t('landing.nav.getStarted')}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick Language Toggle on Mobile */}
          <button
            onClick={toggleLanguage}
            className="p-1.5 text-xs font-mono rounded border border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <span className="uppercase font-semibold text-[10px]">{language}</span>
          </button>

          {/* Theme Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-[#B8860B]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-foreground" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2.5 pb-3 border-b border-border">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-1 flex flex-col gap-2">
            {user ? (
              <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="w-full">
                <Button size="md" className="w-full justify-center">
                  {t('landing.nav.openApp')}
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  size="md"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                >
                  {t('landing.nav.getStarted')}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signin');
                  }}
                >
                  {t('landing.nav.signIn')}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
