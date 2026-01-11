import { useAppSelector } from '@hooks/storeHooks';
import { RoleBasedControls } from './roleBasedControls';

export const UserControls: React.FC = () => {
  const { name } = useAppSelector((state) => state.user);

  if (!name) return null;

  return <RoleBasedControls userName={name} renderAs="list" />;
};
