import React from 'react';
import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from '@tanstack/react-router';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './routes/index';
import { SchedulePage } from './routes/schedule';
import { CalendarPage } from './routes/calendar';
import { TasksPage } from './routes/tasks';
import { HabitsPage } from './routes/habits';
import { GoalsPage } from './routes/goals';
import { SettingsPage } from './routes/settings';

// 1. Root Route with Layout
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

// 2. Child Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/schedule',
  component: SchedulePage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: CalendarPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: TasksPage,
});

const habitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/habits',
  component: HabitsPage,
});

const goalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/goals',
  component: GoalsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

// 3. Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  scheduleRoute,
  calendarRoute,
  tasksRoute,
  habitsRoute,
  goalsRoute,
  settingsRoute,
]);

// 4. Create TanStack Router
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
