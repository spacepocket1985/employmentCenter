// src/components/menu/MealDealModal.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

import {
  IMealDealResponse,
  TMealDealType,
  getMealDealTypeConfig,
  getMealDealTypes,
} from 'src/types/mealDeal.types';
import { getMealDealByType } from 'src/api/mealDealApi';
import MealDealItem from './mealDealItem';

/**
 * Пропсы компонента MealDealModal
 */
interface MealDealModalProps {
  /** Открыто ли модальное окно */
  open: boolean;
  /** Дата для загрузки обедов */
  date: string | null;
  /** Текущий выбранный тип */
  currentType: TMealDealType;
  /** Форматирование цены */
  formatPrice: (price: number) => string;
  /** Обработчик закрытия */
  onClose: () => void;
  /** Обработчик выбора типа */
  onSelect: (type: TMealDealType) => void;
}

/**
 * Компонент модального окна для просмотра всех обедов
 */
const MealDealModal: React.FC<MealDealModalProps> = ({
  open,
  date,
  currentType,
  formatPrice,
  onClose,
  onSelect,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ===== СОСТОЯНИЯ =====
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mealDeals, setMealDeals] = useState<
    Map<TMealDealType, IMealDealResponse | null>
  >(new Map());
  const [selectedType, setSelectedType] = useState<TMealDealType | null>(null);

  const types = getMealDealTypes();

  // ===== ЗАГРУЗКА ДАННЫХ =====
  const loadAllMealDeals = useCallback(async (): Promise<void> => {
    if (!date) {
      setError('Дата не выбрана');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = new Map<TMealDealType, IMealDealResponse | null>();

      // Загружаем все типы параллельно
      const promises = types.map(async (type) => {
        try {
          const response = await getMealDealByType(type, date);
          if (response.success && response.data) {
            results.set(type, response.data);
          } else {
            results.set(type, null);
          }
        } catch {
          results.set(type, null);
        }
      });

      await Promise.all(promises);
      setMealDeals(results);

      // Если есть текущий тип и он есть в результатах, выбираем его
      if (
        currentType &&
        results.has(currentType) &&
        results.get(currentType) !== null
      ) {
        setSelectedType(currentType);
      } else {
        // Иначе выбираем первый доступный
        const firstAvailable = types.find((type) => results.get(type) !== null);
        setSelectedType(firstAvailable || null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(`Ошибка загрузки: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [date, currentType, types]);

  // ===== ЗАГРУЗКА ПРИ ОТКРЫТИИ =====
  useEffect(() => {
    if (open && date) {
      loadAllMealDeals();
    }
  }, [open, date, loadAllMealDeals]);

  // ===== ОБРАБОТЧИК ВЫБОРА =====
  const handleSelect = (): void => {
    if (selectedType) {
      onSelect(selectedType);
      onClose();
    }
  };

  // ===== РЕНДЕР ЗАГРУЗКИ =====
  const renderLoading = (): React.ReactElement => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
      }}
    >
      <CircularProgress />
    </Box>
  );

  // ===== РЕНДЕР ОШИБКИ =====
  const renderError = (): React.ReactElement => (
    <Box sx={{ p: 2 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={loadAllMealDeals}
        size="small"
      >
        Попробовать снова
      </Button>
    </Box>
  );

  // ===== РЕНДЕР СПИСКА ТИПОВ =====
  const renderTypeList = (): React.ReactElement => {
    const hasData = Array.from(mealDeals.values()).some(
      (value) => value !== null
    );

    if (!hasData) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Нет данных для выбранной даты
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        {types.map((type) => {
          const config = getMealDealTypeConfig(type);
          const data = mealDeals.get(type);
          const isSelected = selectedType === type;
          const Icon = config.icon;
          const hasDataForType = data !== null && data!.items.length > 0;

          return (
            <Grid item xs={12} sm={6} key={type}>
              <Paper
                variant="outlined"
                onClick={() => hasDataForType && setSelectedType(type)}
                sx={{
                  p: 2,
                  cursor: hasDataForType ? 'pointer' : 'default',
                  opacity: hasDataForType ? 1 : 0.5,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  borderWidth: isSelected ? 2 : 1,
                  bgcolor: isSelected ? 'primary.50' : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: hasDataForType ? 'primary.main' : 'divider',
                    boxShadow: hasDataForType ? 1 : 0,
                  },
                }}
              >
                {/* Заголовок типа */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon sx={{ color: config.color }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      {config.label}
                    </Typography>
                    {isSelected && (
                      <Chip
                        icon={<CheckIcon fontSize="small" />}
                        label="Выбран"
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: '0.6rem' }}
                      />
                    )}
                    {!hasDataForType && (
                      <Chip
                        label="Нет данных"
                        size="small"
                        color="default"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.6rem' }}
                      />
                    )}
                  </Box>
                  {hasDataForType && data && (
                    <Typography variant="caption" color="text.secondary">
                      {data.items.length} блюд
                    </Typography>
                  )}
                </Box>

                {/* Краткое описание */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mb: 1 }}
                >
                  {config.description}
                </Typography>

                {/* Предпросмотр блюд */}
                {hasDataForType && data && (
                  <Box sx={{ mt: 1 }}>
                    {data.items.slice(0, 3).map((item, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        display="block"
                        sx={{
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.7rem',
                        }}
                      >
                        • {item.name}
                      </Typography>
                    ))}
                    {data.items.length > 3 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        + еще {data.items.length - 3} блюд
                      </Typography>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                    >
                      {formatPrice(data.totalPrice)} р.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // ===== РЕНДЕР ДЕТАЛЬНОГО ПРОСМОТРА =====
  const renderDetailView = (): React.ReactElement | null => {
    if (!selectedType) return null;

    const data = mealDeals.get(selectedType);
    if (!data || data.items.length === 0) return null;

    const config = getMealDealTypeConfig(selectedType);
    const Icon = config.icon;

    return (
      <Box sx={{ mt: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Icon sx={{ color: config.color }} />
          <Typography variant="subtitle1" fontWeight={600}>
            {config.label}
          </Typography>
          <Chip
            label={`${data.items.length} блюд`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {data.items.map((item, index) => (
            <MealDealItem
              key={`${item.name}-${index}`}
              item={item}
              index={index}
              formatPrice={formatPrice}
            />
          ))}
        </Box>

        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Итого:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {data.totalWeight && (
              <Typography variant="body2" color="text.secondary">
                {data.totalWeight} г
              </Typography>
            )}
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatPrice(data.totalPrice)} р.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // ===== РЕНДЕР КОНТЕНТА =====
  const renderContent = (): React.ReactElement => {
    if (loading) return renderLoading();
    if (error) return renderError();
    return (
      <>
        {renderTypeList()}
        {renderDetailView()}
      </>
    );
  };

  // ===== ОСНОВНОЙ РЕНДЕР =====
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Все обеды
          {date && (
            <Typography
              variant="caption"
              component="span"
              sx={{ ml: 1, color: 'text.secondary' }}
            >
              на {date}
            </Typography>
          )}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>{renderContent()}</DialogContent>

      <DialogActions
        sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2 }}
      >
        <Button onClick={onClose} variant="outlined" size="small">
          Закрыть
        </Button>
        <Button
          onClick={handleSelect}
          variant="contained"
          size="small"
          disabled={!selectedType}
          startIcon={<CheckIcon />}
        >
          Выбрать этот обед
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealDealModal;
