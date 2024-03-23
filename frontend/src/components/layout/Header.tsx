import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export const Header = (): JSX.Element => {
  return (
    <AppBar position={'static'}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TEC2 Employment Center
        </Typography>
        <Button color={'inherit'}>Login</Button>
      </Toolbar>
    </AppBar>
  );
};
