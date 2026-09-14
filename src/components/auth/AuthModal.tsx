import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin', onSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const { signIn, signUp, isConfigured } = useAuth();
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsSignUp(initialMode === 'signup');
      setError(null);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await signUp(email, password, fullName);
        if (res.error) {
          setError(res.error);
        } else {
          onClose();
          onSuccess?.();
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          onClose();
          onSuccess?.();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSignUp ? t('auth.signUp') : t('auth.signIn')}
      description={
        isConfigured
          ? t('auth.configuredDesc')
          : t('auth.unconfiguredDesc')
      }
      maxWidth="md"
    >
      <div className="space-y-4">
        {!isConfigured && (
          <div className="p-3 rounded-md bg-[#B8860B]/8 border border-[#B8860B]/20 text-[#B8860B] dark:text-[#D4A843] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">{t('auth.unconfiguredAlertTitle')}</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {t('auth.unconfiguredAlertDesc', { envVar: 'VITE_SUPABASE_URL' })}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2.5 text-xs rounded-md bg-[#BF4040]/8 text-[#BF4040] dark:text-[#D46A6A] border border-[#BF4040]/20">
            {error}
          </div>
        )}

        {isConfigured ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  {t('auth.fullName')}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@routineup.app"
                className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button type="submit" className="w-full mt-2" size="md" isLoading={isLoading}>
              {isSignUp ? t('auth.signUp') : t('auth.signIn')}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-primary hover:underline"
              >
                {isSignUp
                  ? t('auth.alreadyHaveAccount')
                  : t('auth.dontHaveAccount')}
              </button>
            </div>
          </form>
        ) : null}

        {!isConfigured && (
          <div className="pt-2 border-t border-border">
            <p className="text-[11px] text-center text-muted-foreground">
              {t('auth.preconfiguredHint')}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
