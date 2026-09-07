import React from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TMealDealType,
  getMealDealTypeConfig,
  getMealDealTypes,
} from 'src/types/mealDeal.types';

/**
 * Пропсы компонента MealDealSelector
 */
interface MealDealSelectorProps {
  /** Текущий выбранный тип */
  value: TMealDealType;
  /** Обработчик изменения типа */
  onChange: (type: TMealDealType) => void;
  /** Размер кнопок */
  size?: 'small' | 'medium';
  /** Компактный режим */
  compact?: boolean;
}

const MealDealSelector: React.FC<MealDealSelectorProps> = ({
  value,
  onChange,
  size = 'small',
  compact = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const types = getMealDealTypes();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: TMealDealType | null
  ): void => {
    if (newType !== null) {
      onChange(newType);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size={size}
      aria-label="Выбор типа обеда"
      sx={{
        flexWrap: 'nowrap',
        gap: 0.5,
        overflowX: 'auto',
        width: '100%',
        '& .MuiToggleButton-root': {
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          px: compact ? 0.75 : 1.5,
          py: compact ? 0.25 : 0.5,
          textTransform: 'none',
          fontSize: compact ? '0.65rem' : '0.75rem',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          minHeight: compact ? 28 : 36,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        },
      }}
    >
      {types.map((type) => {
        const config = getMealDealTypeConfig(type);
        const isSelected = value === type;
        const Icon = config.icon;

        return (
          <Tooltip key={type} title={config.description} arrow placement="top">
            <ToggleButton value={type} aria-label={config.label}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Icon sx={{ fontSize: compact ? 16 : 20 }} />
                {!isMobile && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: compact ? '0.6rem' : '0.8rem',
                    }}
                  >
                    {config.label}
                  </Typography>
                )}
              </Box>
            </ToggleButton>
          </Tooltip>
        );
      })}
    </ToggleButtonGroup>
  );
};

export default MealDealSelector;
