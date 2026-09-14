import React from 'react';
import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './routes/landing';
import { DashboardPage } from './routes/index';
import { SchedulePage } from './routes/schedule';
import { CalendarPage } from './routes/calendar';
import { TasksPage } from './routes/tasks';
import { HabitsPage } from './routes/habits';
import { GoalsPage } from './routes/goals';
import { SettingsPage } from './routes/settings';

// 1. Root Route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 2. Landing Route (Public)
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// 3. Authenticated App Layout Route
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_app',
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  ),
});

// 4. Protected Child Routes
const appIndexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/app',
  component: DashboardPage,
});

const scheduleRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/schedule',
  component: SchedulePage,
});

const calendarRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/calendar',
  component: CalendarPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/tasks',
  component: TasksPage,
});

const habitsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/habits',
  component: HabitsPage,
});

const goalsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/goals',
  component: GoalsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/settings',
  component: SettingsPage,
});

// 5. Route Tree
const routeTree = rootRoute.addChildren([
  landingRoute,
  appLayoutRoute.addChildren([
    appIndexRoute,
    scheduleRoute,
    calendarRoute,
    tasksRoute,
    habitsRoute,
    goalsRoute,
    settingsRoute,
  ]),
]);

// 6. Create TanStack Router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Register router for TypeScript auto-complete & type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
