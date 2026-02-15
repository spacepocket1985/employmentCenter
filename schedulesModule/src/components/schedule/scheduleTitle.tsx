import { Paper, Typography } from '@mui/material';

type ScheduleTitleProps = {
  scheduleTitle: string;
  year: string;
  monthName: string;
  compactMode?: boolean; // новый пропс
};

export const ScheduleTitle: React.FC<ScheduleTitleProps> = ({
  scheduleTitle,
  year,
  monthName,
  compactMode = false,
}) => {
  const titleFirstPath = scheduleTitle.split(' ')[0];
  const titleSecondPath = scheduleTitle.slice(7);

  // Стили для компактного режима
  const paperStyles = {
    p: compactMode ? 1 : 1,
    mb: compactMode ? 0.2 : 1,
    background: 'linear-gradient(135deg, #103896, #1a4ec2)',
    color: 'white',
    '@media print': {
      background: 'white !important',
      color: 'black !important',
      border: 'none !important',
      boxShadow: 'none !important',
    },
  };

  const typographyStyles = {
    variant: compactMode ? 'subtitle1' : 'h6',
    padding: compactMode ? '0 3rem' : '0 3rem',
    '@media print': {
      color: 'black !important',
      fontWeight: 'bold',
    },
  };

  return (
    <Paper className="plan-header" sx={paperStyles}>
      <Typography align="center" gutterBottom sx={typographyStyles}>
        {titleFirstPath}
        <br />
        {`${titleSecondPath} на ${monthName}, ${year}.`}
      </Typography>
    </Paper>
  );
};
