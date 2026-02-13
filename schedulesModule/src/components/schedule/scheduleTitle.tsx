import { Paper, Typography } from '@mui/material';

type ScheduleTitleProps = {
  scheduleTitle: string;
  year: string;
  monthName: string;
};

export const ScheduleTitle: React.FC<ScheduleTitleProps> = ({
  scheduleTitle,
  year,
  monthName,
}) => {
  const titleFirstPath = scheduleTitle.split(' ')[0];
  const titleSecondPath = scheduleTitle.slice(7);

  return (
    <Paper
      className="plan-header"
      sx={{
        p: 1,
        mb: 1,
        background: 'linear-gradient(135deg, #103896, #1a4ec2)',
        color: 'white',
        '@media print': {
          background: 'white !important',
          color: 'black !important',
          border: '2px solid black !important',
          boxShadow: 'none !important',
        },
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 500,
          padding: '0 3rem',
          '@media print': {
            color: 'black !important',
            fontWeight: 'bold',
          },
        }}
      >
        {titleFirstPath}
        <br />
        {`${titleSecondPath} на ${monthName}, ${year}.`}
      </Typography>
    </Paper>
  );
};
