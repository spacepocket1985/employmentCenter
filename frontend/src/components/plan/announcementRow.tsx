import React from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnnouncementIcon from '@mui/icons-material/Announcement';

interface AnnouncementRowProps {
  announcement: {
    id: string;
    dayNumber: number;
    title: string;
    style?: 'warning' | 'info' | 'success' | 'primary';
    order?: number;
  };
  dayOfWeek: string;
  onRemoveAnnouncement?: (announcementId: string) => void;
}

const AnnouncementRow: React.FC<AnnouncementRowProps> = ({
  announcement,
  dayOfWeek,
  onRemoveAnnouncement,
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
    <TableRow sx={{ 
      bgcolor: styleConfig.bgcolor,
      '&:hover': {
        bgcolor: `${styleConfig.bgcolor}.dark`,
      }
    }}>
      <TableCell 
        colSpan={4}
        sx={{
          py: 2,
          px: 3,
          position: 'relative',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {styleConfig.icon}
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
          
          {onRemoveAnnouncement && (
            <Tooltip title="Удалить анонс">
              <IconButton
                size="small"
                onClick={() => onRemoveAnnouncement(announcement.id)}
                sx={{ 
                  color: styleConfig.color,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default AnnouncementRow;