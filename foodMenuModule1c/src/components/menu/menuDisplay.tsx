import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Button,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
} from '@mui/icons-material';

import CompactMenuFilter from './compactMenuFilter';

import { tableStyles } from '@const/menu.conts';
import { TFoodMenuDayResponse } from 'src/types/foodMenu.types';
import CategoryDivider from './categoryDivider';
import ChefRecommendBadge from './chefRecommendBadge';

interface MenuDisplayProps {
  menu: TFoodMenuDayResponse[];
  isLoading: boolean;
  error: string | null;
  formatPrice: (price: number) => string;
  isToday: (dateString: string) => boolean;
  handlePrint?: () => void;
  refetchMenu: () => void;
  clearError: () => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({
  menu,
  isLoading,
  error,
  formatPrice,
  isToday,
  refetchMenu,
  clearError,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'day'>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // Автоматический выбор сегодняшнего дня
  useEffect(() => {
    if (menu.length > 0) {
      const todayMenu = menu.find((day) => isToday(day.date));

      if (todayMenu) {
        setSelectedDate(todayMenu.date);
        setFilterType('day');
      } else {
        setFilterType('all');
        setSelectedDate(null);
      }
    }
  }, [menu, isToday]);

  const handleFilterTypeChange = (type: 'all' | 'day') => {
    setFilterType(type);

    if (type === 'all') {
      setSelectedDate(null);
    } else if (type === 'day' && !selectedDate) {
      const todayMenu = menu.find((day) => isToday(day.date));
      if (todayMenu) {
        setSelectedDate(todayMenu.date);
      }
    }
  };

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
    if (date) {
      setFilterType('day');
    }
  };

  const filteredMenu = useMemo(() => {
    if (filterType === 'all') {
      return menu;
    }

    if (filterType === 'day' && selectedDate) {
      return menu.filter((day) => day.date === selectedDate);
    }

    return [];
  }, [menu, filterType, selectedDate]);

  const displayMenu = filteredMenu.length > 0 ? filteredMenu : menu;

  // Подсчет количества рекомендаций в дне
  const getRecommendationsCount = (dishes: any[]) => {
    return dishes.filter((d) => d.isChefRecommend).length;
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={refetchMenu}
          startIcon={<RefreshIcon />}
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  if (menu.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="info">
          Меню пока не загружено. Пожалуйста, зайдите позже.
        </Alert>
        <Button
          variant="outlined"
          onClick={refetchMenu}
          startIcon={<RefreshIcon />}
          sx={{ mt: 2 }}
        >
          Обновить
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}
      ref={contentRef}
    >
      {/* Заголовок */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #103896, #1a4ec2)',
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Меню столовой
        </Typography>

        <Typography variant="body2" align="center" sx={{ mt: 1, opacity: 0.8 }}>
          {menu.length > 1 && `${menu[0].date} - ${menu.at(-1)?.date}`}
        </Typography>
      </Paper>

      {/* Панель управления */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <CompactMenuFilter
          menu={menu}
          filterType={filterType}
          selectedDate={selectedDate}
          onFilterTypeChange={handleFilterTypeChange}
          onDateChange={handleDateChange}
          isToday={isToday}
        />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refetchMenu}
            className="no-print"
          >
            Обновить
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={reactToPrintFn}
            className="no-print"
            sx={{ bgcolor: '#103896', '&:hover': { bgcolor: '#0a2c7a' } }}
          >
            Печать меню
          </Button>
        </Box>
      </Box>

      {displayMenu.length === 0 && filterType === 'day' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Нет данных для выбранной даты. Выберите другую дату или покажите все
          дни.
        </Alert>
      )}

      {/* Отображение меню по дням */}
      {displayMenu.map((day: TFoodMenuDayResponse) => {
        const hasRecommendations = day.dishes.some(
          (dish) => dish.isChefRecommend
        );
        const recommendationsCount = getRecommendationsCount(day.dishes);

        return (
          <Paper
            key={day.date}
            className="menu-day"
            sx={{
              mb: 3,
              overflow: 'hidden',
              border: isToday(day.date)
                ? '2px solid #103896'
                : '1px solid #dee2e6',
              boxShadow: isToday(day.date)
                ? '0 4px 20px rgba(16, 56, 150, 0.15)'
                : '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            {/* Заголовок дня */}
            <Box
              sx={{
                p: 2,
                bgcolor: isToday(day.date) ? '#e7f1ff' : '#f8f9fa',
                borderBottom: '1px solid #dee2e6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#103896',
                }}
              >
                {day.date} — {day.dayOfWeek}
                {isToday(day.date) && (
                  <Chip
                    label="Сегодня"
                    color="primary"
                    size="small"
                    sx={{ ml: 2, fontWeight: 600 }}
                  />
                )}
                {filterType === 'day' && selectedDate === day.date && (
                  <Chip
                    label="Выбранный день"
                    color="secondary"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>

              {/* Индикатор рекомендаций в заголовке */}
              {hasRecommendations && (
                <Tooltip title={`${recommendationsCount} блюд от шефа`} arrow>
                  <Chip
                    icon={
                      <StarIcon fontSize="small" sx={{ color: '#ffb300' }} />
                    }
                    label={`Выбор шефа (${recommendationsCount})`}
                    color="warning"
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: '#fff8e1',
                      borderColor: '#ffb300',
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: '#ffb300',
                      },
                    }}
                  />
                </Tooltip>
              )}
            </Box>

            {/* Таблица блюд */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell
                      align="center"
                      sx={{ ...tableStyles.header, width: '8%' }}
                    >
                      №
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ ...tableStyles.header, width: '62%' }}
                    >
                      Наименование блюда
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ ...tableStyles.header, width: '15%' }}
                    >
                      Выход, г
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ ...tableStyles.header, width: '15%' }}
                    >
                      Цена, руб.
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {day.dishes.map((dish, index, array) => {
                    const isChefRecommend = dish.isChefRecommend || false;
                    const currentCategory = dish.category;
                    const prevCategory =
                      index > 0 ? array[index - 1].category : null;

                    // Показываем разделитель, если категория изменилась
                    const showCategoryDivider =
                      index > 0 &&
                      prevCategory &&
                      currentCategory &&
                      prevCategory !== currentCategory;

                    return (
                      <React.Fragment key={dish.number}>
                        {/* Разделитель категорий */}
                        {showCategoryDivider && currentCategory && (
                          <TableRow>
                            <TableCell colSpan={4} sx={{ p: 0 }}>
                              <CategoryDivider category={currentCategory} />
                            </TableCell>
                          </TableRow>
                        )}

                        {/* Строка с блюдом */}
                        <TableRow
                          sx={{
                            '&:hover': {
                              bgcolor: isChefRecommend ? '#ffecb3' : '#f8f9fa',
                            },
                            // Подсветка для рекомендаций шефа
                            bgcolor: isChefRecommend
                              ? '#fff8e1' // Светло-золотистый фон
                              : index % 2 === 0
                              ? '#ffffff'
                              : '#f8f9fa',
                            // Левая граница для рекомендаций
                            borderLeft: isChefRecommend
                              ? '4px solid #ffb300'
                              : '4px solid transparent',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <TableCell align="center" sx={tableStyles.number}>
                            {dish.number}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              ...tableStyles.body,
                              paddingLeft: 3,
                              paddingRight: 3,
                              fontWeight: isChefRecommend ? 600 : 400,
                            }}
                          >
                            {dish.name[0].toLocaleUpperCase() +
                              dish.name.slice(1)}

                            {/* Отметка "Выбор шефа" - иконка звезды с тултипом */}
                            <ChefRecommendBadge
                              show={isChefRecommend}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center" sx={tableStyles.number}>
                            {dish.weight}
                          </TableCell>
                          <TableCell align="center" sx={tableStyles.price}>
                            {formatPrice(dish.price)}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        );
      })}

      {/* Футер */}
      <Box
        sx={{
          mt: 4,
          pt: 2,
          borderTop: '1px solid #dee2e6',
          textAlign: 'center',
        }}
      >
        <div className="print-footer">
          <Typography variant="body2" color="text.secondary">
            {filterType === 'all'
              ? `Показано ${
                  displayMenu.length
                } дней, всего ${displayMenu.reduce(
                  (acc, day) => acc + day.dishes.length,
                  0
                )} блюд`
              : `Показано ${displayMenu.length} день, ${displayMenu.reduce(
                  (acc, day) => acc + day.dishes.length,
                  0
                )} блюд`}
          </Typography>
          <Typography variant="body1">
            Меню столовой Гродненская ТЭЦ-2
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default MenuDisplay;
