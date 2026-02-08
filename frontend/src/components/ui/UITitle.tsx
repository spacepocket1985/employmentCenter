import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { TypographyProps } from '@mui/material/Typography';

type UITitleProps = TypographyProps & {
  children: ReactNode;
  variant?: TypographyProps['variant'];
};

export const UITitle: React.FC<UITitleProps> = ({
  children,
  variant = 'body1',
  sx,
  ...rest
}) => {
  return (
    <Typography
      variant={variant}
      gutterBottom
      sx={{
        p: 1,
        backgroundColor: '#1976d2',
        borderRadius: 1,
        color: 'white',
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 1,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Typography>
  );
};
