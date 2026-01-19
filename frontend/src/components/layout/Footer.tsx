import { Toolbar, IconButton, Grid, Typography, Box } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';

export const Footer = (): JSX.Element => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        width: '100%',
        mt: 'auto',
        py: 2,
      }}
    >
      <Toolbar>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <IconButton color="inherit" aria-label="адрес">
              <HomeIcon sx={{ mr: 1 }} />{' '}
              <Typography variant="subtitle2" component="span">
                г. Гродно, шоссе Скидельское, 10
              </Typography>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton color="inherit" aria-label="телефон">
              <LocalPhoneIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" component="span">
                {'32-47'}
              </Typography>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton color="inherit" aria-label="электронная почта">
              <EmailIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle2" component="span">
                {'klintsevich@energo.grodno.by'}
              </Typography>
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </Box>
  );
};
