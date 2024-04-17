import { AppBar, Toolbar, Typography, IconButton, Grid } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';

import { UserAuth } from '../auth/auth';
import { UIModal } from '../ui/UIModal';
import { userActions } from '../../store/slices/userSlice';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../../routes/routePaths';

export const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);

  const onLogOutClickHandler = () => {
    dispatch(userActions.logOutUser());
  };

  const handleGoTEC2Click = () => {
    window.location.href = 'http://tec23.grodno.energo.net/';
  };

  return (
    <AppBar position={'static'}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <IconButton
            onClick={handleGoTEC2Click}
            style={{
              borderRadius: '10px',
              color: '#fff',
              backgroundColor: '#1976d2',
            }}
          >
            <HomeIcon style={{ color: '#fff', marginRight: '5px' }} />
            <Typography variant="subtitle2" component="span">
              {'Сайт ТЭЦ-2'}
            </Typography>
          </IconButton>
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
