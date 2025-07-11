import {
  PageAbout,
  PageEmployees,
  PageNotFound,
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
];
