import { Paper, Typography } from '@mui/material';
type MainTitleProps = {
  title: string;
};

export const MainTitle: React.FC<MainTitleProps> = ({ title }) => {
  return (
    <Paper>
      <Typography
        align="center"
        gutterBottom
        sx={{
          typography: 'h5',
          background: 'linear-gradient(135deg, #103896, #1a4ec2)',
          color: 'white',
          p: 2,
        }}
      >
        {title}
      </Typography>
    </Paper>
  );
};
