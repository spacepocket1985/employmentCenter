import { lazy } from 'react';

export const PageAbout = lazy(() => import('./AboutPage'));
export const PageNotFound = lazy(() => import('./Page404'));
export const PageEmployees = lazy(() => import('./EmployeesPage'));
export const PageVacancies = lazy(() => import('./VacanciesPage'));
export const PageVacancy = lazy(() => import('./VacancyPage'));
export const PageMenu = lazy(() => import('./MenuPage'));

export const PagePlanCreate = lazy(() => import('./PlanCreatePage'));
export const PagePlans = lazy(() => import('./PlansPage'));
export const PagePlan = lazy(() => import('./PlanPage'));

export const PageScheduleCreate = lazy(() => import('./ScheduleCreatePage'));
export const PageSchedules = lazy(() => import('./SchedulesPage'));
export const PageScheduleEdit = lazy(() => import('./ScheduleEditPage'));

export const PageBusRouteCreate = lazy(() => import('./BusRouteCreatePage'));
