// Описание: Компонент для отображения рекомендаций
// Показывает список рекомендаций с иконками

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

/**
 * Props для ResultRecommendations
 */
type ResultRecommendationsProps = {
  /** Массив рекомендаций */
  recommendations: string[];
};

/**
 * Компонент для отображения рекомендаций
 */
export const ResultRecommendations: React.FC<ResultRecommendationsProps> = ({
  recommendations,
}: ResultRecommendationsProps): React.ReactElement | null => {
  // Если нет рекомендаций, ничего не показываем
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9ff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LightbulbIcon sx={{ color: '#103896' }} />
        <Typography variant="h6" sx={{ color: '#103896' }}>
          Рекомендации
        </Typography>
      </Box>

      <List dense>
        {recommendations.map((rec: string, index: number) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary={rec}
              primaryTypographyProps={{
                variant: 'body2',
                color: 'text.primary',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
