import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { IMealDealItem } from 'src/types/mealDeal.types';
import { getCategoryIcon, getCategoryColor } from '@utils/dishCategoryUtils';
import { TDishCategory } from 'src/types/foodMenu.types';

/**
 * Пропсы компонента MealDealItem
 */
interface MealDealItemProps {
  /** Данные блюда */
  item: IMealDealItem;
  /** Индекс для чередования стилей */
  index?: number;
  /** Форматирование цены */
  formatPrice?: (price: number) => string;
  /** Компактный режим */
  compact?: boolean;
}

/**
 * Компонент для отображения одного блюда в рекомендации обеда (компактная версия)
 */
const MealDealItem: React.FC<MealDealItemProps> = ({
  item,
  index = 0,
  formatPrice = (price: number) => price.toFixed(2).replace('.', ','),
  compact = true,
}) => {
  const category = (item.category || 'other') as TDishCategory;
  const IconComponent = getCategoryIcon(category);
  const categoryColor = getCategoryColor(category);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: compact ? 0.4 : 0.75,
        px: compact ? 0.75 : 1.5,
        borderRadius: 1,
        bgcolor: index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.04)',
        },
        minHeight: compact ? 28 : 36,
      }}
    >
      {/* Левая часть: иконка + название */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? 1 : 1.5,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Иконка категории (компактная) */}
        <Tooltip title={category} arrow>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: compact ? 20 : 28,
              height: compact ? 20 : 28,
              borderRadius: '50%',
              bgcolor: `${categoryColor}15`,
              color: categoryColor,
              flexShrink: 0,
            }}
          >
            <IconComponent sx={{ fontSize: compact ? 14 : 20 }} />
          </Box>
        </Tooltip>

        {/* Название блюда */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: compact ? '0.75rem' : '0.9rem',
          }}
        >
          {item.name}
        </Typography>
      </Box>

      {/* Правая часть: вес и цена */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? 1 : 2,
          flexShrink: 0,
        }}
      >
        {/* Вес */}
        {item.weight && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              minWidth: compact ? 35 : 50,
              textAlign: 'right',
              fontSize: compact ? '0.7rem' : '0.875rem',
            }}
          >
            {item.weight}
          </Typography>
        )}

        {/* Цена */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            minWidth: compact ? 40 : 50,
            textAlign: 'right',
            fontSize: compact ? '0.75rem' : '0.875rem',
          }}
        >
          {formatPrice(item.price)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MealDealItem;
