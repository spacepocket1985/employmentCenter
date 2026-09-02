import React from 'react';
import { Tooltip, Box } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

interface ChefRecommendBadgeProps {
  show?: boolean;
  size?: 'small' | 'medium';
}

/**
 * Компонент для отображения отметки "Выбор шефа"
 * Только иконка звезды с тултипом
 */
const ChefRecommendBadge: React.FC<ChefRecommendBadgeProps> = ({
  show = true,
  size = 'small',
}) => {
  if (!show) return null;

  return (
    <Tooltip title="Выбор шефа" arrow>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          ml: 0.5,
          color: '#ffb300',
        }}
      >
        <StarIcon fontSize={size === 'small' ? 'small' : 'medium'} />
      </Box>
    </Tooltip>
  );
};

export default ChefRecommendBadge;
