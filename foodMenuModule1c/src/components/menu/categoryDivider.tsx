import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { TDishCategory } from 'src/types/foodMenu.types';
import {
  getCategoryLabel,
  getCategoryIcon,
  getCategoryColor,
} from '@utils/dishCategoryUtils';

interface CategoryDividerProps {
  category: TDishCategory | string;
}

/**
 * Визуальный разделитель между категориями блюд
 * Упрощенная версия с нейтральным фоном
 */
const CategoryDivider: React.FC<CategoryDividerProps> = ({ category }) => {
  const label = getCategoryLabel(category);
  const IconComponent = getCategoryIcon(category);
  const color = getCategoryColor(category);

  return (
    <Box
      className="category-divider"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: 0.5,
        px: 2,
        my: 0.25,
        bgcolor: '#e7f1ff',
        borderTop: '1px solid #d0e0f5',
        borderBottom: '1px solid #d0e0f5',
      }}
    >
      <Divider sx={{ flex: 1, borderColor: '#c5d8f0', opacity: 0.3 }} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.25,
          bgcolor: 'white',
          borderRadius: 1.5,
          border: '1px solid #d0e0f5',
        }}
      >
        <IconComponent sx={{ fontSize: 16, color: color }} />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: color,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}
        >
          {label}
        </Typography>
      </Box>

      <Divider sx={{ flex: 1, borderColor: '#c5d8f0', opacity: 0.3 }} />
    </Box>
  );
};

export default CategoryDivider;
