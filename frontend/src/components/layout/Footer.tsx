import { AppBar, Toolbar, IconButton, Box, Grid } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';

export const Footer = (): JSX.Element => {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        <Grid container spacing={2} justifyContent="flex-end">
          <IconButton color="inherit" aria-label="open drawer">
            <HomeIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="open drawer">
            <LocalPhoneIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="open drawer">
            <EmailIcon />
          </IconButton>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
