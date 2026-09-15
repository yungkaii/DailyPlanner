import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  CheckSquare,
  Flame,
  Target,
  Settings,
  Plus,
} from 'lucide-react';

interface MobileNavProps {
  onOpenCommand: () => void;
}

export function MobileNav({ onOpenCommand }: MobileNavProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Left items before center (+) button
  const leftLinks = [
    { to: '/app', label: t('nav.today'), icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { to: '/schedule', label: t('nav.schedule'), icon: <Clock className="w-4 h-4 shrink-0" /> },
    { to: '/tasks', label: t('nav.tasks'), icon: <CheckSquare className="w-4 h-4 shrink-0" /> },
  ];

  // Right items after center (+) button
  const rightLinks = [
    { to: '/habits', label: t('nav.habits'), icon: <Flame className="w-4 h-4 shrink-0" /> },
    { to: '/goals', label: t('nav.goalsShort', 'Target'), icon: <Target className="w-4 h-4 shrink-0" /> },
    { to: '/calendar', label: t('nav.calendar'), icon: <CalendarDays className="w-4 h-4 shrink-0" /> },
    { to: '/settings', label: t('nav.settingsShort', 'Settings'), icon: <Settings className="w-4 h-4 shrink-0" /> },
  ];

  // Check scroll boundaries
  const updateScrollIndicators = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    updateScrollIndicators();
    window.addEventListener('resize', updateScrollIndicators);
    return () => window.removeEventListener('resize', updateScrollIndicators);
  }, [updateScrollIndicators]);

  // Smoothly center the active tab whenever route changes
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
    // Update scroll fades after transition
    const timer = setTimeout(updateScrollIndicators, 300);
    return () => clearTimeout(timer);
  }, [location.pathname, updateScrollIndicators]);

  const renderLinkItem = (item: { to: string; label: string; icon: React.ReactNode }) => {
    const isActive = location.pathname === item.to;
    return (
      <Link
        key={item.to}
        ref={isActive ? activeLinkRef : undefined}
        to={item.to}
        className={`flex flex-col items-center justify-center min-w-[54px] sm:min-w-[60px] py-1 px-1.5 rounded-lg transition-all shrink-0 text-center select-none ${
          isActive
            ? 'text-primary font-semibold bg-primary/10'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 active:bg-muted/60'
        }`}
      >
        <span className={isActive ? 'text-primary scale-105 transition-transform' : 'text-muted-foreground'}>
          {item.icon}
        </span>
        <span className="text-[10px] tracking-tight whitespace-nowrap mt-0.5">
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg safe-area-pb"
    >
      {/* Scroll indicator: Left fade */}
      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-card to-transparent z-10"
        />
      )}

      {/* Scroll indicator: Right fade */}
      {canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-card to-transparent z-10"
        />
      )}

      {/* Scrollable Nav Container */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollIndicators}
        className="flex items-center justify-start min-[540px]:justify-around px-2 py-1.5 gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {/* Left items: Today, Schedule, Tasks */}
        {leftLinks.map(renderLinkItem)}

        {/* Center Quick Action Button */}
        <button
          type="button"
          onClick={onOpenCommand}
          aria-label={t('nav.quickAction')}
          title={t('nav.quickAction')}
          className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center -mt-1 mx-0.5 cursor-pointer shadow-md hover:opacity-95 active:scale-95 transition-all shrink-0 ring-2 ring-background"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Right items: Habits, Goals, Calendar, Settings */}
        {rightLinks.map(renderLinkItem)}
      </div>
    </nav>
  );
}
