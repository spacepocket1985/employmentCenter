import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Skeleton,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Restaurant as RestaurantIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocalDining as StarIcon,
} from '@mui/icons-material';

import {
  IMealDealResponse,
  TMealDealType,
  getMealDealTypeConfig,
  canRefreshMealDeal,
} from 'src/types/mealDeal.types';
import MealDealItem from './mealDealItem';
import MealDealSelector from './mealDealSelector';

/**
 * Пропсы компонента MealDealCard
 */
interface MealDealCardProps {
  /** Данные обеда */
  data: IMealDealResponse | null;
  /** Состояние загрузки */
  isLoading: boolean;
  /** Ошибка */
  error: string | null;
  /** Текущий тип обеда */
  currentType: TMealDealType;
  /** Форматирование цены */
  formatPrice: (price: number) => string;
  /** Обработчик изменения типа */
  onTypeChange: (type: TMealDealType) => void;
  /** Обработчик обновления */
  onRefresh: () => void;
  /** Обработчик очистки ошибки */
  onClearError: () => void;
  /** Заголовок карточки */
  title?: string;
  /** Показывать ли селектор */
  showSelector?: boolean;
  /** Начальное состояние (открыт/закрыт) */
  defaultExpanded?: boolean;
}

/**
 * Компонент для отображения рекомендации обеда в виде аккордеона
 */
const MealDealCard: React.FC<MealDealCardProps> = ({
  data,
  isLoading,
  error,
  currentType,
  formatPrice,
  onTypeChange,
  onRefresh,
  onClearError,
  title = 'Предложение обеда',
  showSelector = true,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  const config = getMealDealTypeConfig(currentType);
  const Icon = config.icon;
  const showRefresh = canRefreshMealDeal(currentType);

  // ===== ОБРАБОТЧИКИ =====
  const handleToggle = (): void => {
    setExpanded(!expanded);
  };

  const handleTypeChange = (type: TMealDealType): void => {
    onTypeChange(type);
    // Не закрываем аккордеон при смене типа
  };

  // ===== РЕНДЕР ЗАГРУЗКИ =====
  const renderLoading = (): React.ReactElement => (
    <Box sx={{ p: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={100} height={20} />
      </Box>
      {[1, 2, 3].map((index) => (
        <Skeleton
          key={index}
          variant="text"
          width="100%"
          height={24}
          sx={{ mb: 0.25 }}
        />
      ))}
      <Skeleton variant="text" width={80} height={20} sx={{ mt: 0.5 }} />
    </Box>
  );

  // ===== РЕНДЕР ОШИБКИ =====
  const renderError = (): React.ReactElement => (
    <Box sx={{ p: 1.5 }}>
      <Alert severity="error" onClose={onClearError} sx={{ mb: 1 }}>
        {error}
      </Alert>
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        size="small"
      >
        Попробовать снова
      </Button>
    </Box>
  );

  // ===== РЕНДЕР ПУСТОГО СОСТОЯНИЯ =====
  const renderEmpty = (): React.ReactElement => (
    <Box
      sx={{
        p: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <RestaurantIcon
        sx={{ fontSize: 28, color: 'text.secondary', opacity: 0.3 }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '0.75rem' }}
      >
        Нет данных для рекомендации
      </Typography>
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        size="small"
        sx={{ mt: 0.5 }}
      >
        Обновить
      </Button>
    </Box>
  );

  // ===== РЕНДЕР СОДЕРЖИМОГО =====
  const renderContent = (): React.ReactElement => {
    if (!data || data.items.length === 0) {
      return renderEmpty();
    }

    return (
      <>
        {/* Список блюд */}
        <Box sx={{ px: 1.5, py: 0.5 }}>
          {data.items.map((item, index) => (
            <MealDealItem
              key={`${item.name}-${index}`}
              item={item}
              index={index}
              formatPrice={formatPrice}
              compact={false}
            />
          ))}
        </Box>

        <Divider />

        {/* Итоги */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              Итого:
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                fontSize: '0.9rem',
              }}
            >
              {formatPrice(data.totalPrice)} р.
            </Typography>
            {data.totalWeight && (
              <Chip
                label={`${data.totalWeight} г`}
                variant="outlined"
                sx={{ height: 20, fontSize: '0.9rem' }}
              />
            )}
          </Box>

          {/* Кнопка "Другой вариант" */}
          {showRefresh && (
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              size="small"
              sx={{ minWidth: 80, fontSize: '0.65rem', py: 0.25 }}
            >
              Другой
            </Button>
          )}
        </Box>
      </>
    );
  };

  // ===== ОСНОВНОЙ РЕНДЕР =====

  // Определяем, показывать ли индикатор загрузки в заголовке
  const showLoadingIndicator = isLoading && !expanded;

  return (
    <Paper
      elevation={0}
      sx={{
        border: '2px solid',
        borderColor: expanded ? 'primary.main' : '#1976d2',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: expanded
          ? '0 4px 20px rgba(16, 56, 150, 0.15)'
          : '0 2px 8px rgba(255, 179, 0, 0.15)',
        '&:hover': {
          boxShadow: expanded
            ? '0 6px 24px rgba(16, 56, 150, 0.2)'
            : '0 4px 12px rgba(255, 179, 0, 0.2)',
        },
      }}
    >
      {/* ============================================================ */}
      {/* === ЗАГОЛОВОК-СТРОКА (всегда видна) === */}
      {/* ============================================================ */}
      <Box
        onClick={handleToggle}
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: expanded ? 'primary.main' : '#fff',
          color: expanded ? 'white' : 'text.primary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: expanded ? 'primary.dark' : '#ffa000',
          },
          userSelect: 'none',
        }}
      >
        {/* Левая часть: иконка + заголовок + бейдж */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Иконка звезды для привлечения внимания */}
          <StarIcon
            sx={{
              fontSize: 20,
              color: expanded ? 'white' : '#d32f2f',
              animation: expanded ? 'none' : 'pulse 2s infinite',
            }}
          />

          {/* Заголовок */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              color: expanded ? 'white' : 'text.primary',
            }}
          >
            {title}
          </Typography>

          {/* Желтый бейдж с типом */}
          <Chip
            icon={<Icon sx={{ fontSize: 14, color: 'inherit' }} />}
            label={config.label}
            size="small"
            sx={{
              bgcolor: expanded ? 'rgba(255,255,255,0.2)' : '#d32f2f2',
              color: expanded ? 'white' : 'text.primary',
              fontWeight: 600,
              height: 24,
              '& .MuiChip-label': {
                fontSize: '.8rem',
                px: 1,
              },
              '& .MuiChip-icon': {
                color: 'inherit',
              },
            }}
          />

          {/* Индикатор количества блюд */}
          {data && data.items.length > 0 && !expanded && (
            <Chip
              label={`${data.items.length} блюда`}
              size="small"
              variant="outlined"
              sx={{
                height: 20,
                fontSize: '0.8rem',
                borderColor: 'rgba(0,0,0,0.2)',
                color: 'rgba(0,0,0,0.6)',
                '& .MuiChip-label': {
                  px: 0.75,
                },
              }}
            />
          )}

          {/* Индикатор загрузки в свернутом состоянии */}
          {showLoadingIndicator && (
            <CircularProgress size={16} sx={{ color: 'white' }} />
          )}
        </Box>

        {/* Правая часть: цена + иконка раскрытия */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          {/* Краткая цена в свернутом состоянии */}
          {data && data.items.length > 0 && !expanded && (
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: expanded ? 'white' : 'primary.main',
                fontSize: '0.85rem',
              }}
            >
              {formatPrice(data.totalPrice)} р.
            </Typography>
          )}

          {/* Иконка раскрытия */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            sx={{
              color: expanded ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: expanded
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* ============================================================ */}
      {/* === РАСКРЫВАЮЩАЯСЯ ЧАСТЬ === */}
      {/* ============================================================ */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {/* Селектор типов */}
        {showSelector && (
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              bgcolor: 'grey.50',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <MealDealSelector
              value={currentType}
              onChange={handleTypeChange}
              size="small"
              compact={false}
            />
          </Box>
        )}

        {/* Основной контент */}
        {isLoading ? renderLoading() : error ? renderError() : renderContent()}
      </Collapse>

      {/* ============================================================ */}
      {/* === СТИЛИ ДЛЯ АНИМАЦИИ === */}
      {/* ============================================================ */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}
      </style>
    </Paper>
  );
};

export default MealDealCard;
