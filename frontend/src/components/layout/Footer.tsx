import { AppBar, Toolbar, IconButton, Box, Grid, Typography } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';

export const Footer = (): JSX.Element => {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar>
        <Grid container spacing={1} justifyContent="center">
          <IconButton color="inherit" aria-label="open drawer">
            <HomeIcon style={{marginRight: '5px'}}/>
            <Typography variant='subtitle2' component="span">
            г. Гродно, шоссе Скидельское, 10 
          </Typography>
          </IconButton>
          <IconButton color="inherit" aria-label="open drawer" >
            <LocalPhoneIcon style={{marginRight: '5px'}}/>
            <Typography variant='subtitle2' component="span">
            {'+375 (15) 245-33-57 '}
          </Typography>
          </IconButton>
          <IconButton color="inherit" aria-label="open drawer">
            <EmailIcon style={{marginRight: '5px'}}/>
            <Typography variant='subtitle2' component="span">
              {'moroztatiana@energo.grodno.by'}
            </Typography>

          </IconButton>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
