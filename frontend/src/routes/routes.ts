import {
  PageAbout,
  PageBusRouteCreate,
  PageEmployees,
  PageMenu,
  PageNotFound,
  PagePlan,
  PagePlanCreate,
  PagePlans,
  PageScheduleCreate,
  PageScheduleEdit,
  PageSchedules,
  PageVacancies,
  PageVacancy,
} from '@pages/index';
import { RoutePaths } from './routePaths';

export const publicRoutes = [
  {
    path: RoutePaths.ABOUT,
    Page: PageAbout,
  },
  {
    path: RoutePaths.VACANCYLIST,
    Page: PageVacancies,
  },

  {
    path: RoutePaths.VACANCY,
    Page: PageVacancy,
  },

  {
    path: RoutePaths.PAGE404,
    Page: PageNotFound,
  },
];

export const privateRoutes = [
  {
    path: RoutePaths.EMPLOYEES,
    Page: PageEmployees,
  },
  {
    path: RoutePaths.MENU,
    Page: PageMenu,
  },
  {
    path: RoutePaths.CREATE_PLANS,
    Page: PagePlanCreate,
  },
  {
    path: RoutePaths.PLAN,
    Page: PagePlan,
  },
  {
    path: RoutePaths.PLANS,
    Page: PagePlans,
  },
  {
    path: RoutePaths.CREATE_SCHEDULE,
    Page: PageScheduleCreate,
  },
  {
    path: RoutePaths.SCHEDULES,
    Page: PageSchedules,
  },
  {
    path: RoutePaths.EDIT_SCHEDULE,
    Page: PageScheduleEdit,
  },
  {
    path: RoutePaths.CREATE_BUS_ROUTE,
    Page: PageBusRouteCreate,
  },
];
