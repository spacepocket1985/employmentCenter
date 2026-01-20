import React from 'react';
import { Paper, Typography } from '@mui/material';

interface PlaceholderStepProps {
  message: string;
}

export const PlaceholderStep: React.FC<PlaceholderStepProps> = ({
  message,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '150px',
      }}
    >
      <Typography color="text.secondary" textAlign="center">
        {message}
      </Typography>
    </Paper>
  );
};
