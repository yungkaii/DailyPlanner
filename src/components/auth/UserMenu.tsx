import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Database, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  onOpenAuth: () => void;
}

export function UserMenu({ onOpenAuth }: UserMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-colors cursor-pointer"
      >
        <User className="w-3.5 h-3.5" />
        <span>{t('auth.signIn')}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-md hover:bg-muted transition-colors text-left cursor-pointer"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name || 'User'}
            className="w-6 h-6 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-[11px]">
            {(user.full_name || user.email || 'U')[0].toUpperCase()}
          </div>
        )}

        <div className="hidden md:block text-left">
          <p className="text-xs font-medium text-foreground leading-none">
            {user.full_name || user.email.split('@')[0]}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] text-[#5E8C61] font-medium flex items-center gap-0.5">
              <Database className="w-2.5 h-2.5" /> Supabase
            </span>
          </div>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-52 rounded-lg bg-card border border-border shadow-md p-1 z-50">
            <div className="px-2.5 py-2 border-b border-border mb-1">
              <p className="text-xs font-semibold text-foreground">
                {user.full_name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user.email}
              </p>
            </div>

            <button
              onClick={async () => {
                setIsOpen(false);
                await signOut();
                navigate({ to: '/' });
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#BF4040] hover:bg-[#BF4040]/5 rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('auth.signOut')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
