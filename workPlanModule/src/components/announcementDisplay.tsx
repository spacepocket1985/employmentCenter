import React from 'react';
import { TableRow, TableCell, Box, Typography } from '@mui/material';
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
          bgcolor: '#fff8e1',
          color: '#8a6d3b',
          icon: <WarningIcon sx={{ color: '#f57c00' }} />,
          borderColor: '#ffe0b2'
        };
      case 'success':
        return {
          bgcolor: '#e8f5e9',
          color: '#2e7d32',
          icon: <CheckCircleIcon sx={{ color: '#388e3c' }} />,
          borderColor: '#c8e6c9'
        };
      case 'primary':
        return {
          bgcolor: '#e3f2fd',
          color: '#1565c0',
          icon: <AnnouncementIcon sx={{ color: '#1976d2' }} />,
          borderColor: '#bbdefb'
        };
      case 'info':
      default:
        return {
          bgcolor: '#e1f5fe',
          color: '#0277bd',
          icon: <InfoIcon sx={{ color: '#0288d1' }} />,
          borderColor: '#b3e5fc'
        };
    }
  };

  const styleConfig = getStyleConfig();

  return (
    <TableRow 
      sx={{ 
        bgcolor: styleConfig.bgcolor,
        borderBottom: `1px solid ${styleConfig.borderColor}`,
        '&:hover': {
          bgcolor: styleConfig.bgcolor,
          opacity: 0.95
        }
      }}
    >
      <TableCell colSpan={4} sx={{ py: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 0.5,
            px: 2,
          }}
        >
          {styleConfig.icon}
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: styleConfig.color,
              }}
            >
              {announcement.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: styleConfig.color,
                opacity: 0.8,
                display: 'block',
                mt: 0.5,
                fontSize: '0.8rem'
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