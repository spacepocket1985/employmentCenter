// Описание: Компонент для отображения рекомендаций
// Показывает список рекомендаций с иконками и улучшенным дизайном

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

/**
 * Props для ResultRecommendations
 */
type ResultRecommendationsProps = {
  /** Массив рекомендаций */
  recommendations: string[];
  /** Заголовок блока */
  title?: string;
};

/**
 * Компонент для отображения рекомендаций
 */
export const ResultRecommendations: React.FC<ResultRecommendationsProps> = ({
  recommendations,
  title = 'Рекомендации',
}: ResultRecommendationsProps): React.ReactElement | null => {
  // Если нет рекомендаций, ничего не показываем
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'rgba(16, 56, 150, 0.15)',
        backgroundColor: 'rgba(16, 56, 150, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: '#103896',
          borderRadius: '4px 0 0 4px',
        },
      }}
    >
      {/* Заголовок с иконкой */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#103896',
            color: 'white',
          }}
        >
          <LightbulbIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ color: '#103896', fontWeight: 600 }}>
          {title}
        </Typography>
        <Chip
          label={`${recommendations.length} рекомендаций`}
          size="small"
          sx={{
            ml: 'auto',
            backgroundColor: 'rgba(16, 56, 150, 0.1)',
            color: '#103896',
            fontWeight: 500,
            fontSize: '0.7rem',
          }}
        />
      </Box>

      {/* Список рекомендаций */}
      <List dense sx={{ py: 0 }}>
        {recommendations.map((rec: string, index: number) => (
          <ListItem
            key={index}
            sx={{
              px: 1,
              py: 1,
              borderBottom: index < recommendations.length - 1 ? '1px solid' : 'none',
              borderColor: 'rgba(16, 56, 150, 0.06)',
              alignItems: 'flex-start',
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
              <ArrowForwardIcon sx={{ color: '#103896', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary={rec}
              primaryTypographyProps={{
                variant: 'body2',
                color: 'text.primary',
                sx: { lineHeight: 1.5 },
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Футер с рекомендацией действия */}
      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'rgba(16, 56, 150, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
        <Typography variant="caption" color="text.secondary">
          Следуйте этим рекомендациям для улучшения состояния
        </Typography>
      </Box>
    </Paper>
  );
};