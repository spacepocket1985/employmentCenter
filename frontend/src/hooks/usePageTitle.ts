import { RoutePaths } from '@routes/routePaths';
import { useLocation } from 'react-router-dom';

type RouteTitleRule = {
  test: (pathname: string) => boolean;
  title: string;
};

const titleRules: RouteTitleRule[] = [
  // точные и/или префиксные правила
  {
    test: (p) => p.endsWith(RoutePaths.EMPLOYEES),
    title: 'Список сотрудников',
  },
  {
    test: (p) => p.endsWith('/vacancy'),
    title: 'Вакансии Гродненской ТЭЦ-2',
  },
  {
    test: (p) => p.endsWith(RoutePaths.MENU),
    title: 'Меню столовой Гродненской ТЭЦ-2',
  },
  {
    test: (p) => p.endsWith('/staff') || p === '/',
    title: 'Панель управления',
  },
  {
    test: (p) => p.endsWith('/plan') || p === '/',
    title: 'Панель работ',
  },
];

// Универсальная функция-хук
export function usePageTitle(): string {
  const { pathname } = useLocation();

  const found = titleRules.find((r) => r.test(pathname));

  return found?.title ?? 'Панель управления';
}
