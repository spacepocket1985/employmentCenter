import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from './routes';

export const AppRouter = () => {
  return (
    <Routes>
      {publicRoutes.map(({ path, Page }) => (
        <Route path={path} key={path} element={<Page />} />
      ))}
    </Routes>
  );
};
