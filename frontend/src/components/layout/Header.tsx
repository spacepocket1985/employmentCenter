import { useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Grid } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import { UIModal } from '@components/ui';
import { BaseUrl } from '@store/config';
import { UserAuth } from '@components/auth';
import { userStorage } from '@utils/userStorage';
import { usePageTitle } from '@hooks/usePageTitle';
import { userActions } from '@store/slices';
import { HeaderMenu } from '@components/layout';
import { handleErrorMsg } from '@utils/handleRequestResult';

export const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);
  const pageTitle = usePageTitle();

  useEffect(() => {
    const getUserIdByToken = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const response = await fetch(`${BaseUrl}/auth/findUser`, {
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
    <AppBar position={'static'} style={{ marginBottom: '5px' }}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <HeaderMenu user={user} />
          <Typography variant="h6" component="div" style={{ flexGrow: '1' }}>
            {pageTitle}
          </Typography>

          {user ? (
            <IconButton
              aria-label="logOut"
              onClick={onLogOutClickHandler}
              style={{ borderRadius: '10px', backgroundColor: '#fff' }}
            >
              <Typography
                variant="subtitle1"
                component="span"
                style={{
                  color: '#1976d2',
                  marginRight: '5px',
                  fontWeight: 'bold',
                }}
              >
                {`Выход`}
              </Typography>
              <LogoutIcon color="primary" />
            </IconButton>
          ) : (
            <UIModal
              iconType="account"
              iconButtonStyle={{ color: '#fff' }}
              top="15%"
            >
              {(handleClose) => <UserAuth handleClose={handleClose} />}
            </UIModal>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
