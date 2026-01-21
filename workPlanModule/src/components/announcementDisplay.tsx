import React from 'react';
import { TableRow, TableCell, Box, Typography, Icon } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { Announcement } from 'src/types/plan.types';

interface AnnouncementDisplayProps {
  announcement: Announcement;
  dayOfWeek: string;
}

const AnnouncementDisplay: React.FC<AnnouncementDisplayProps> = ({
  announcement,
  dayOfWeek,
}) => {
  const getStyleConfig = () => {
    switch (announcement.style) {
      case 'warning':
        return {
          bgcolor: 'warning.light',
          color: 'warning.contrastText',
          icon: <WarningIcon />,
        };
      case 'success':
        return {
          bgcolor: 'success.light',
          color: 'success.contrastText',
          icon: <CheckCircleIcon />,
        };
      case 'primary':
        return {
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          icon: <AnnouncementIcon />,
        };
      case 'info':
      default:
        return {
          bgcolor: 'info.light',
          color: 'info.contrastText',
          icon: <InfoIcon />,
        };
    }
  };

  const styleConfig = getStyleConfig();

  return (
    <TableRow sx={{ bgcolor: styleConfig.bgcolor }}>
      <TableCell colSpan={4}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 1,
            px: 2,
          }}
        >
          <Icon sx={{ color: styleConfig.color }}>{styleConfig.icon}</Icon>
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                color: styleConfig.color,
                textTransform: 'uppercase',
              }}
            >
              {announcement.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: styleConfig.color,
                opacity: 0.9,
                display: 'block',
                mt: 0.5,
              }}
            >
              Анонс для {announcement.dayNumber} {dayOfWeek}
            </Typography>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default AnnouncementDisplay;