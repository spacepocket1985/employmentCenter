import { RoutePaths } from '@routes/routePaths';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

export type MuiIconType = OverridableComponent<
  SvgIconTypeMap<object, 'svg'>
> & {
  muiName: string;
};

export enum UserRole {
  ADMIN = 'admin',
  OKIPR = 'okipr',
  COP = 'cop',
  ONIOT = 'oniot',
  SMIT = 'smit',
}

export interface ControlItem {
  text: string;
  icon: MuiIconType;
  link: RoutePaths;
  roles: UserRole[];
}

// Утилита для определения роли по имени пользователя
export const getUserRole = (userName: string | null): UserRole | null => {
  if (!userName) return null;

  switch (userName.toLowerCase()) {
    case 'admin':
      return UserRole.ADMIN;
    case 'okipr':
      return UserRole.OKIPR;
    case 'cop':
      return UserRole.COP;
    case 'oniot':
      return UserRole.ONIOT;
    default:
      return null;
  }
};
