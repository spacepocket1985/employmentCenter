import { IconButton, Typography } from '@mui/material';

type ButtonIconProps = {
  text?: string;
  children?: React.ReactNode;
  color?: string;
  textSize?: string;
};
export const ButtonIcon: React.FC<ButtonIconProps> = ({
  text,
  children,
  color,
  textSize,
}) => {
  return (
    <IconButton
      aria-label="open drawer"
      sx={{ justifyContent: 'flex-start', color: color ? color : '#fff' }}
    >
      {children}
      <Typography
        variant="subtitle2"
        component="span"
        sx={{ fontSize: textSize }}
      >
        {text}
      </Typography>
    </IconButton>
  );
};
