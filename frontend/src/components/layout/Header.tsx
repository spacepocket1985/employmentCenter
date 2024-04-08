import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { infoActions } from '../../store/slices/infoSlice';
import { UserAuth } from '../auth/auth';

export const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.info.user);
  const login = useAppSelector((state) => state.info.login);

  const handleClick = () => {
    login
      ? dispatch(infoActions.logOutUser())
      : dispatch(infoActions.logInUser());
  };

  return (
    <AppBar position={'static'}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Список вакансий Гродненской ТЭЦ-2
        </Typography>
        {login && <UserAuth />}
        <Button color={'inherit'} onClick={handleClick}>
          {!login ? 'Login' : 'Logout'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
