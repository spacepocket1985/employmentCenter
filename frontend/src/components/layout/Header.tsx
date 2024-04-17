import { AppBar, Toolbar, Typography, IconButton, Grid } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';

import { UserAuth } from '../auth/auth';
import { UIModal } from '../ui/UIModal';
import { userActions } from '../../store/slices/userSlice';
import { Link } from 'react-router-dom';

export const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);

  const onLogOutClickHandler = () => {
    dispatch(userActions.logOutUser());
  };

  return (
    <AppBar position={'static'}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div" style={{ flexGrow: '1' }}>
            <Link
              to="/"
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
              <LogoutIcon style={{ color: '#fff' }} />
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
