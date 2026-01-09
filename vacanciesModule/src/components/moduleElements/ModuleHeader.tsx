import { Box, Typography } from '@mui/material';

type ModuleHeaderProps = {
  title?: string;
  children?: React.ReactNode;
  backgroundColor?: string;
};
export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  title,
  children,
  backgroundColor,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        backgroundColor: backgroundColor ? backgroundColor : '#103896',
        width: '100%',
        textTransform: 'uppercase',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        mb: 1,
        mr: 'auto',
      }}
    >
      {children}
      <Typography
        component="h3"
        variant="body2"
        color={'white'}
        fontWeight={600}
      >
        {title}
      </Typography>
    </Box>
  );
};
