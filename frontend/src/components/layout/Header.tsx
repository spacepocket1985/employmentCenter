import { AppBar, Toolbar, Typography, IconButton, Grid } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';

import { UserAuth } from '../auth/auth';
import { UIModal } from '../ui/UIModal';
import { userActions } from '../../store/slices/userSlice';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../../routes/routePaths';
import { userStorage } from '../../utils/userStorage';

import { serverEndPoint } from '../../store/slices/apiSlice';
import { useEffect } from 'react';
import { handleErrorMsg } from '../../utils/handleRequestResult';
import { HeaderMenu } from './HeaderMenu';

export const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);

  useEffect(() => {
    const getUserIdByToken = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const response = await fetch(`${serverEndPoint}auth/findUser`, {
          headers: { Authorization: token },
        });
        const data = await response.json();

        if (response.ok) {
          dispatch(userActions.logInUser({ name: data.data, token }));
        } else {
          const error = new Error(
            'Действия токена прошло. Необходимо зайти заново!'
          );
          handleErrorMsg(error.message);
        }
      }
    };

    getUserIdByToken();
  }, [dispatch]);

  const onLogOutClickHandler = async () => {
    await dispatch(userActions.logOutUser());
    await userStorage.removeUserInLocalStorage();
  };

  return (
    <AppBar position={'static'} style={{marginBottom:'5px'}}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <HeaderMenu user={user} />
          <Typography variant="h6" component="div" style={{ flexGrow: '1' }}>
            <Link
              to={RoutePaths.HOME}
              style={{
                textAlign: 'center',
                textDecoration: 'none',
                color: '#fff',
              }}
            >
              Вакансии Гродненской ТЭЦ-2
            </Link>
          </Typography>

          {user ? (
            <IconButton aria-label="logOut" onClick={onLogOutClickHandler}>
              <Typography
                variant="subtitle1"
                component="span"
                style={{ color: '#fff' }}
              >
                {`Hello, ${user}`}
              </Typography>
              <LogoutIcon style={{ color: '#fff', marginLeft: '5px' }} />
              <Typography
                variant="subtitle1"
                component="span"
                style={{ color: '#fff' }}
              >
                Выход
              </Typography>
            </IconButton>
          ) : (
            <UIModal
              iconType="account"
              iconButtonStyle={{ color: '#fff' }}
              top="15%"
              iconLabel="Вход"
            >
              {(handleClose) => <UserAuth handleClose={handleClose} />}
            </UIModal>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
