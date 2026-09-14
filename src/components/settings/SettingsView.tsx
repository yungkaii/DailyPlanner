import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { localStore } from '../../lib/storage';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/Button';
import {
  Database,
  RefreshCw,
  Sun,
  Moon,
  Keyboard,
  Check,
  Copy,
  Languages,
} from 'lucide-react';

export function SettingsView() {
  const { t } = useTranslation();
  const { isConfigured, isDemo, enableDemoMode, disableDemoMode } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleResetData = () => {
    localStore.resetAll();
    queryClient.invalidateQueries();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleCopySchemaPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

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

      {/* Supabase Status Card */}
      <div className="rounded-lg p-5 bg-card border border-border space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-muted text-primary">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                {t('settings.supabaseTitle')}
                {isConfigured && !isDemo ? (
                  <span className="text-[11px] bg-[#5E8C61]/10 text-[#5E8C61] border border-[#5E8C61]/20 px-2 py-0.2 rounded font-medium">
                    {t('settings.connected')}
                  </span>
                ) : (
                  <span className="text-[11px] bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20 px-2 py-0.2 rounded font-medium">
                    {t('settings.sandboxDemo')}
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isConfigured && !isDemo
                  ? t('settings.connectedDesc')
                  : t('settings.sandboxDesc')}
              </p>
            </div>
          </div>

          {isConfigured && (
            <Button
              variant="outline"
              size="sm"
              onClick={isDemo ? disableDemoMode : enableDemoMode}
            >
              {isDemo ? t('settings.switchToSupabase') : t('settings.switchToDemo')}
            </Button>
          )}
        </div>

        <div className="p-3 rounded-md bg-muted/40 border border-border space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">
              {t('settings.postgresSchema')}
            </span>
            <button
              onClick={handleCopySchemaPath}
              className="inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5E8C61]" />
                  <span>{t('settings.pathCopied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('settings.copyPath')}</span>
                </>
              )}
            </button>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {t('settings.schemaDesc', { path: 'supabase/schema.sql' })}
          </p>
        </div>
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

      {/* Sample Data & Reset */}
      <div className="rounded-lg p-5 bg-card border border-border space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              {t('settings.demoTitle')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('settings.demoSubtitle')}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            {t('settings.resetBtn')}
          </Button>
        </div>

        {resetSuccess && (
          <div className="p-2.5 text-xs rounded-md bg-[#5E8C61]/8 text-[#5E8C61] border border-[#5E8C61]/20 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{t('settings.resetSuccess')}</span>
          </div>
        )}
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
