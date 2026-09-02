import React from 'react';
import { Box, Typography } from '@mui/material';
import { TDishCategory } from 'src/types/foodMenu.types';
import {
  getCategoryLabel,
  getCategoryIcon,
  getCategoryColor,
  getCategoryBackgroundColor,
} from '@utils/dishCategoryUtils';

interface CategoryDividerProps {
  category: TDishCategory;
}

/**
 * Визуальный разделитель между категориями блюд
 * С иконкой, цветом и названием категории
 */
const CategoryDivider: React.FC<CategoryDividerProps> = ({ category }) => {
  const label = getCategoryLabel(category);
  const IconComponent = getCategoryIcon(category); // Получаем компонент иконки
  const color = getCategoryColor(category);
  const bgColor = getCategoryBackgroundColor(category);

  return (
    <Box
      className="category-divider"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: 1,
        px: 2,
        my: 0.5,
        bgcolor: bgColor,
        borderTop: `2px solid ${color}`,
        borderBottom: `2px solid ${color}`,
        borderRadius: 1,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          flex: 1,
          height: 1,
          bgcolor: color,
          opacity: 0.3,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: color,
          fontWeight: 600,
          px: 2,
          py: 0.5,
          bgcolor: 'white',
          borderRadius: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', color: color }}>
          <IconComponent fontSize="small" />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: color,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            fontSize: '0.7rem',
          }}
        >
          {label}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          height: 1,
          bgcolor: color,
          opacity: 0.3,
        }}
      />
    </Box>
  );
};

export default CategoryDivider;
