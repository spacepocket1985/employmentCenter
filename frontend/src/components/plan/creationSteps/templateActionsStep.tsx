import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { planStylesForCreate } from 'src/const';

interface TemplateActionsStepProps {
  workingSaturdaysCount: number;
  specialDaysCount: number;
  announcementsCount: number;
  isLoading: boolean;
  onCreateTemplate: () => void;
  onResetAll: () => void;
}

export const TemplateActionsStep: React.FC<TemplateActionsStepProps> = ({
  workingSaturdaysCount,
  specialDaysCount,
  announcementsCount,
  isLoading,
  onCreateTemplate,
  onResetAll,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      elevation={3}
    >
      <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
        5. Создать план мероприятий
      </Typography>
      <Box
        sx={{
          mt: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ mb: 2 }}
        >
          После выбора рабочих суббот, специальных дней и анонсов нажмите кнопку
          для создания шаблона плана.
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">Выбрано:</Typography>
            <Typography variant="body2" color="text.secondary">
              • Рабочих суббот: {workingSaturdaysCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Специальных дней: {specialDaysCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Анонсов: {announcementsCount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={onCreateTemplate}
              disabled={isLoading}
            >
              Создать шаблон плана
            </Button>

            <Button
              variant="outlined"
              onClick={onResetAll}
              color="error"
              disabled={isLoading}
            >
              Сбросить все
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
