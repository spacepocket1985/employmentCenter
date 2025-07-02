import { Typography } from '@mui/material';
import { ReactNode } from 'react';

type UITitleProps = {
  children: ReactNode;
};

export const UITitle: React.FC<UITitleProps> = ({ children }) => {
  return (
    <Typography
      variant="caption"
      sx={{
        p: 1,
        backgroundColor: '#1976d2',
        borderRadius: 1,
        color: 'white',
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
};
