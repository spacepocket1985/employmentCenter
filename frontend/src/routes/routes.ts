import { AboutPage } from '../pages/AboutPage';
import { HomePage } from '../pages/HomePage';
import { Page404 } from '../pages/Page404';
import { VacancyPage } from '../pages/VacancyPage';

import { RoutePaths } from './routePaths';

export const publicRoutes = [
  {
    path: RoutePaths.ABOUT,
    Page: AboutPage,
  },
  {
    path: RoutePaths.HOME,
    Page: HomePage,
  },
  {
    path: RoutePaths.VACANCY,
    Page: VacancyPage,
  },

  {
    path: RoutePaths.PAGE404,
    Page: Page404,
  },
];
