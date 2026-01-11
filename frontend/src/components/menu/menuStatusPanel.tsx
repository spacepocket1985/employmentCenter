import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { MenuStatus } from 'src/types/menu.types';
import { UITitle } from '@components/ui';

interface MenuStatusPanelProps {
  status: MenuStatus | null | undefined;
  isLoading: boolean;
}

export const MenuStatusPanel: React.FC<MenuStatusPanelProps> = ({
  status,
  isLoading,
}) => {
  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <UITitle variant="body1"> Текущее состояние</UITitle>

      {status ? (
        <Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Дней: ${status.daysCount}`}
              color="primary"
              size="small"
            />
            <Chip
              icon={<CheckCircleIcon />}
              label={`Блюд: ${status.dishesCount}`}
              color="secondary"
              size="small"
            />
          </Box>

          {status.dates.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Даты в меню:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                {status.dates.map((date) => (
                  <Chip
                    key={date}
                    label={date}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Alert severity="info">Меню не загружено</Alert>
      )}
    </Paper>
  );
};

export default MenuStatusPanel;
