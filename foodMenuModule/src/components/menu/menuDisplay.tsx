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
} from '@mui/material';
import {
  Print as PrintIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Menu, DayMenu } from 'src/types/menu.types';
import CompactMenuFilter from './compactMenuFilter';

import { tableStyles } from '@const/menu.conts';

interface MenuDisplayProps {
  menu: Menu;
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
  // Стили для печати

  // === СОСТОЯНИЯ ФИЛЬТРАЦИИ ===
  // Вся логика управления состоянием фильтрации находится здесь
  const [filterType, setFilterType] = useState<'all' | 'day'>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // === ЭФФЕКТ ДЛЯ АВТОМАТИЧЕСКОГО ВЫБОРА СЕГОДНЯШНЕГО ДНЯ ===
  // Выполняется только при загрузке меню (когда меняется menu)
  useEffect(() => {
    if (menu.length > 0) {
      // Ищем сегодняшний день в меню
      const todayMenu = menu.find((day) => isToday(day.date));

      if (todayMenu) {
        // Если сегодняшний день найден, автоматически выбираем его
        setSelectedDate(todayMenu.date);
        setFilterType('day');
      } else {
        // Если сегодняшнего дня нет, показываем все дни
        setFilterType('all');
        setSelectedDate(null);
      }
    }
  }, [menu, isToday]); // Зависимости: menu и isToday

  // === ОБРАБОТЧИКИ ИЗМЕНЕНИЯ ФИЛЬТРОВ ===
  // Эти функции передаются в дочерний компонент CompactMenuFilter

  /**
   * Обработчик изменения типа фильтра (все дни/выбрать день)
   */
  const handleFilterTypeChange = (type: 'all' | 'day') => {
    setFilterType(type);

    if (type === 'all') {
      // При переключении на "все дни" сбрасываем выбранную дату
      setSelectedDate(null);
    } else if (type === 'day' && !selectedDate) {
      // При переключении на "выбрать день" и если дата не выбрана,
      // пробуем выбрать сегодняшний день
      const todayMenu = menu.find((day) => isToday(day.date));
      if (todayMenu) {
        setSelectedDate(todayMenu.date);
      }
    }
  };

  /**
   * Обработчик изменения выбранной даты
   */
  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);

    // При выборе даты автоматически переключаемся на режим "выбрать день"
    if (date) {
      setFilterType('day');
    }
  };

  // === ФИЛЬТРАЦИЯ МЕНЮ ===
  // Используем useMemo для оптимизации, чтобы не фильтровать на каждом рендере
  const filteredMenu = useMemo(() => {
    if (filterType === 'all') {
      // Режим "все дни" - возвращаем всё меню
      return menu;
    }

    if (filterType === 'day' && selectedDate) {
      // Режим "выбрать день" - фильтруем по выбранной дате
      return menu.filter((day) => day.date === selectedDate);
    }

    // Если ничего не подошло, возвращаем пустой массив
    return [];
  }, [menu, filterType, selectedDate]);

  // Используем отфильтрованное меню или полное, если отфильтрованное пустое
  const displayMenu = filteredMenu.length > 0 ? filteredMenu : menu;

  // === СОСТОЯНИЯ ЗАГРУЗКИ И ОШИБОК ===

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

  // === РЕНДЕРИНГ КОМПОНЕНТА ===

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

      {/* Панель управления с фильтрами и кнопками */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Компонент фильтрации - передаем состояние и обработчики */}
        <CompactMenuFilter
          menu={menu}
          filterType={filterType}
          selectedDate={selectedDate}
          onFilterTypeChange={handleFilterTypeChange}
          onDateChange={handleDateChange}
          isToday={isToday}
        />

        {/* Кнопки управления */}
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

      {/* Сообщение если нет данных после фильтрации */}
      {displayMenu.length === 0 && filterType === 'day' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Нет данных для выбранной даты. Выберите другую дату или покажите все
          дни.
        </Alert>
      )}

      {/* Отображение меню по дням */}
      {displayMenu.map((day: DayMenu) => (
        <Paper
          key={day.date}
          className="menu-day"
          sx={{
            mb: 3,
            overflow: 'hidden',
            border: isToday(day.date)
              ? '2px solid #103896'
              : '1px solid #dee2e6',
          }}
        >
          {/* Заголовок дня */}
          <Box
            sx={{
              p: 2,
              bgcolor: isToday(day.date) ? '#e7f1ff' : '#f8f9fa',
              borderBottom: '1px solid #dee2e6',
            }}
          >
            <Typography
              variant="h5"
              align="center"
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
                  sx={{ ml: 2 }}
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
                {day.dishes.map((dish, index) => (
                  <TableRow
                    key={dish.number}
                    sx={{
                      '&:hover': { bgcolor: '#f8f9fa' },
                      bgcolor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
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
                      }}
                    >
                      {dish.name}
                    </TableCell>
                    <TableCell align="center" sx={tableStyles.number}>
                      {dish.weight}
                    </TableCell>
                    <TableCell align="center" sx={tableStyles.price}>
                      {formatPrice(dish.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}

      {/* Футер с информацией */}
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

      {/* Стили для печати */}
    </Box>
  );
};

export default MenuDisplay;
