import { AppBar, Toolbar, Typography, IconButton, Grid } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';

import { UserAuth } from '../auth/auth';
import { UIModal } from '../ui/UIModal';
import { userActions } from '../../store/slices/userSlice';

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
            Вакансии Гродненской ТЭЦ-2
          </Typography>
          {user ? (
            <IconButton aria-label="logOut" onClick={onLogOutClickHandler}>
              <LogoutIcon style={{ color: '#fff' }} />
            </IconButton>
          ) : (
            <UIModal iconType="account" iconButtonStyle={{color:'#fff'}} top="15%">
              {(handleClose) => <UserAuth handleClose={handleClose} />}
            </UIModal>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
