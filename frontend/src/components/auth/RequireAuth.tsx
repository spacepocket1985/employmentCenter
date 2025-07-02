import { useAppSelector } from '@hooks/storeHooks';
import { RoutePaths } from '@routes/routePaths';
import { Navigate, Outlet } from 'react-router-dom';

export const RequireAuth: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { name } = useAppSelector((state) => state.user);

  if (!name) {
    return <Navigate to={RoutePaths.ABOUT} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};
