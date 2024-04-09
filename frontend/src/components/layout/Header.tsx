import { AppBar, Toolbar, Typography, IconButton, Grid } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { infoActions } from '../../store/slices/infoSlice';
import { UserAuth } from '../auth/auth';
import { UIModal } from '../ui/UIModal';

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
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Список вакансий Гродненской ТЭЦ-2
          </Typography>
          <UIModal iconType="account" iconColor="#fff">
            {(handleClose) => <UserAuth handleClose={handleClose} />}
          </UIModal>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
