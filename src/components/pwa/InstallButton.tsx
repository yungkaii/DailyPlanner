import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Download,
  Share,
  PlusSquare,
  Check,
  Smartphone,
  Monitor,
  WifiOff,
  MoreVertical,
  MonitorDown,
  AlertCircle,
} from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';

interface InstallButtonProps {
  variant?: 'primary' | 'outline' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  className?: string;
  /** Extra content rendered under the button, e.g. platform badges. */
  showHint?: boolean;
}

/**
 * "Unduh Aplikasi" CTA.
 *
 * Chrome/Edge/Opera (desktop & Android) get the native install prompt. iOS
 * Safari and desktop Safari/Firefox have no programmatic install API, so those
 * fall back to a short how-to modal matched to the current platform.
 */
export function InstallButton({
  variant = 'primary',
  size = 'md',
  leftIcon,
  className,
  showHint = false,
}: InstallButtonProps) {
  const { t } = useTranslation();
  const { isInstalled, canInstall, guide, isPrompting, promptInstall } = usePwaInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return (
      <Button
        variant="subtle"
        size={size}
        className={className}
        leftIcon={leftIcon ?? <Check className="w-4 h-4" />}
        disabled
      >
        {t('pwa.installed')}
      </Button>
    );
  }

  const handleClick = async () => {
    if (canInstall) {
      const result = await promptInstall();
      // A dismissal or a dead prompt still needs the manual how-to, otherwise
      // the user is left with a button that appears broken.
      if (result !== 'accepted') setShowGuide(true);
      return;
    }
    // No native prompt available — explain the manual path for this platform.
    setShowGuide(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        isLoading={isPrompting}
        leftIcon={leftIcon ?? <Download className="w-4 h-4" />}
      >
        {t('pwa.installCta')}
      </Button>

      {showHint && (
        <p className="text-xs text-muted-foreground mt-2.5 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-primary shrink-0" />
          {t('pwa.installHint')}
        </p>
      )}

      <Modal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        title={t(`pwa.guide.${guide}.title`)}
        description={t(`pwa.guide.${guide}.subtitle`)}
        maxWidth="sm"
      >
        <ol className="space-y-3.5">
          <Step index={1} icon={<GuideIcon guide={guide} step={1} />}>
            {t(`pwa.guide.${guide}.step1`)}
          </Step>
          <Step index={2} icon={<GuideIcon guide={guide} step={2} />}>
            {t(`pwa.guide.${guide}.step2`)}
          </Step>
          <Step index={3} icon={<GuideIcon guide={guide} step={3} />}>
            {t(`pwa.guide.${guide}.step3`)}
          </Step>
        </ol>

        {/* Chrome only exposes the install flow over HTTPS or on localhost. */}
        {guide === 'chromium' && typeof isSecureContext !== 'undefined' && !isSecureContext && (
          <div className="mt-5 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#BF4040]/10 border border-[#BF4040]/25">
            <AlertCircle className="w-4 h-4 text-[#BF4040] shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">{t('pwa.guide.secureContext')}</p>
          </div>
        )}

        {guide === 'unsupported' && (
          <div className="mt-5 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-primary/8 border border-primary/15">
            <Monitor className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">
              {t('pwa.guide.unsupported.note')}
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/8 border border-primary/15">
          <WifiOff className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-foreground leading-relaxed">{t('pwa.offlineNote')}</p>
        </div>

        <Button
          variant="outline"
          size="md"
          className="w-full justify-center mt-4"
          onClick={() => setShowGuide(false)}
        >
          {t('common.close')}
        </Button>
      </Modal>
    </>
  );
}

function GuideIcon({ guide, step }: { guide: string; step: number }) {
  if (guide === 'ios') {
    if (step === 1) return <Share className="w-4 h-4" />;
    if (step === 2) return <PlusSquare className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  }
  if (guide === 'chromium') {
    if (step === 1) return <MonitorDown className="w-4 h-4" />;
    if (step === 2) return <MoreVertical className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  }
  if (step === 3) return <Check className="w-4 h-4" />;
  return <MoreVertical className="w-4 h-4" />;
}

function Step({
  index,
  icon,
  children,
}: {
  index: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          'shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary',
          'flex items-center justify-center font-mono text-[11px] font-semibold mt-0.5'
        )}
      >
        {index}
      </span>
      <span className="text-sm text-foreground leading-relaxed flex items-center gap-2">
        {children}
        <span className="text-muted-foreground shrink-0">{icon}</span>
      </span>
    </li>
  );
}