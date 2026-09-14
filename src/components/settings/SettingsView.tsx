import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sun,
  Moon,
  Keyboard,
  Languages,
} from 'lucide-react';

export function SettingsView() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {t('settings.title')}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Language Switcher Card */}
      <div className="rounded-lg p-5 bg-card border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-primary" />
          <h3 className="font-serif text-base font-semibold text-foreground">
            {t('settings.languageTitle')}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('settings.languageSubtitle')}
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-xs">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-2.5 p-3 rounded-md border transition-colors cursor-pointer ${
              language === 'en'
                ? 'border-primary bg-primary/5 text-primary font-semibold'
                : 'border-border hover:bg-muted text-foreground'
            }`}
          >
            <span className="text-base">🇬🇧</span>
            <span className="text-xs">{t('settings.english')}</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('id')}
            className={`flex items-center gap-2.5 p-3 rounded-md border transition-colors cursor-pointer ${
              language === 'id'
                ? 'border-primary bg-primary/5 text-primary font-semibold'
                : 'border-border hover:bg-muted text-foreground'
            }`}
          >
            <span className="text-base">🇮🇩</span>
            <span className="text-xs">{t('settings.indonesian')}</span>
          </button>
        </div>
      </div>

      {/* Appearance & Theme */}
      <div className="rounded-lg p-5 bg-card border border-border space-y-3">
        <h3 className="font-serif text-base font-semibold text-foreground">
          {t('settings.appearanceTitle')}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t('settings.appearanceSubtitle')}
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-xs">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2.5 p-3 rounded-md border transition-colors cursor-pointer ${
              theme === 'light'
                ? 'border-primary bg-primary/5 text-primary font-semibold'
                : 'border-border hover:bg-muted text-foreground'
            }`}
          >
            <Sun className="w-4 h-4 text-[#B8860B]" />
            <span className="text-xs">{t('settings.lightMode')}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2.5 p-3 rounded-md border transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'border-primary bg-primary/5 text-primary font-semibold'
                : 'border-border hover:bg-muted text-foreground'
            }`}
          >
            <Moon className="w-4 h-4 text-primary" />
            <span className="text-xs">{t('settings.darkMode')}</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="rounded-lg p-5 bg-card border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-primary" />
          <h3 className="font-serif text-base font-semibold text-foreground">
            {t('settings.keyboardTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border">
            <span className="text-muted-foreground">{t('settings.commandPalette')}</span>
            <kbd className="font-mono bg-card px-2 py-0.5 rounded border border-border text-foreground">
              ⌘K / Ctrl+K
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border">
            <span className="text-muted-foreground">{t('settings.closeModals')}</span>
            <kbd className="font-mono bg-card px-2 py-0.5 rounded border border-border text-foreground">
              ESC
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
