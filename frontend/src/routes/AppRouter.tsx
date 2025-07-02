import { Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { Suspense } from 'react';
import { Spinner } from '@components/spinner';
import { MainLayout } from '@components/layout';
import { RoutePaths } from './routePaths';
import { RequireAuth } from '@components/auth';

export const AppRouter = (): JSX.Element => {
  return (
    <Routes>
      {/* Редирект с корня на /staff */}
      <Route path="/" element={<Navigate to={RoutePaths.ABOUT} replace />} />

      {/* Основной маршрут - /staff */}
      <Route path={RoutePaths.ABOUT} element={<MainLayout />}>
        <Route element={<RequireAuth />}>
          {privateRoutes.map(({ path, Page }) => (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<Spinner />}>
                  <Page />
                </Suspense>
              }
            />
          ))}
        </Route>
        {/* Вложенные маршруты внутри /staff */}
        {publicRoutes.map(({ path, Page }) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<Spinner />}>
                <Page />
              </Suspense>
            }
          />
        ))}
      </Route>
    </Routes>
  );
};
