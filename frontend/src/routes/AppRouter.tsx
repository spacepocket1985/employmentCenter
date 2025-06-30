import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from './routes';
import { Suspense } from 'react';
import { Spinner } from '@components/spinner';

export const AppRouter = (): JSX.Element => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {publicRoutes.map(({ path, Page }) => (
          <Route path={path} key={path} element={<Page />} />
        ))}
      </Routes>
    </Suspense>
  );
};
