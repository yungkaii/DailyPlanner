import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Chrome's prompt() never settles without a UI (headless, kiosk); bail out. */
const PROMPT_TIMEOUT_MS = 3000;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

// Capture the event as early as possible — Chrome fires it once, after load.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari does not implement display-mode; it uses the navigator proxy.
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS 13+ reports as Mac; touch points disambiguate it.
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
}

export function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // Chrome, Edge and Opera all carry "Safari" in their UA — exclude them first.
  return /safari/i.test(ua) && !/crios|fxios|edg|chrome|chromium|opr\//i.test(ua);
}

/** Which manual install instructions fit the current browser. */
export type InstallGuide = 'ios' | 'android' | 'chromium' | 'unsupported';

export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

export interface UsePwaInstallResult {
  /** True while the app runs from the home screen / installed window. */
  isInstalled: boolean;
  /** True when a native install prompt is available (Chrome/Edge/Android). */
  canInstall: boolean;
  /** True on iOS, where installation must be done manually via Share. */
  isIOSDevice: boolean;
  /** Which manual steps match the current browser. */
  guide: InstallGuide;
  /** True while the native prompt is on screen. */
  isPrompting: boolean;
  /** Result of the last install attempt, so the UI can react. */
  outcome: InstallOutcome | null;
  promptInstall: () => Promise<InstallOutcome>;
}

export function usePwaInstall(): UsePwaInstallResult {
  const [isInstalled, setIsInstalled] = useState(isStandalone);
  const [canInstall, setCanInstall] = useState(deferredPrompt !== null);
  const [isPrompting, setIsPrompting] = useState(false);
  const [outcome, setOutcome] = useState<InstallOutcome | null>(null);

  useEffect(() => {
    const sync = () => {
      setCanInstall(deferredPrompt !== null);
      setIsInstalled(isStandalone());
    };

    listeners.add(sync);
    sync();

    const mq = window.matchMedia('(display-mode: standalone)');
    mq.addEventListener('change', sync);

    return () => {
      listeners.delete(sync);
      mq.removeEventListener('change', sync);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    const event = deferredPrompt;

    if (!event) {
      setOutcome('unavailable');
      return 'unavailable';
    }

    setIsPrompting(true);

    // Chrome's prompt() settles once the user answers, but never settles in
    // environments with no UI (headless, kiosk). Race it against a timeout so
    // the button can never hang on an unresolved promise.
    let choice: 'accepted' | 'dismissed' = 'dismissed';
    try {
      const result = await Promise.race([
        event.prompt().then(() => event.userChoice),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('prompt-timeout')), PROMPT_TIMEOUT_MS)
        ),
      ]);
      choice = result.outcome;
    } catch {
      // Timed out or prompt() threw — treat as a dismissal.
    }

    // The event is single-use; clear it so we never offer a dead button.
    if (deferredPrompt === event) deferredPrompt = null;
    notify();
    setIsPrompting(false);

    setOutcome(choice);
    if (choice === 'accepted') setIsInstalled(true);
    return choice;
  }, []);

  const guide: InstallGuide = isIOS()
    ? 'ios'
    : isAndroid()
      ? 'android'
      : // Desktop Chrome/Edge/Opera support the install flow; Safari and
        // Firefox on desktop do not offer any PWA install path at all.
        isSafari()
        ? 'unsupported'
        : 'chromium';

  return {
    isInstalled,
    canInstall,
    isIOSDevice: isIOS(),
    guide,
    isPrompting,
    outcome,
    promptInstall,
  };
}