// components/schedule/DatePickerPopup.tsx

import React, { useState } from 'react';
import {
  Box,
  Popover,
  IconButton,
  Typography,
  Button,
  Chip,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  EventAvailable as EventIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { formatDateForDisplay } from 'src/utils/dateUtils';
import { getDaysInMonthForSchedule, parseMonthYear } from '@utils/scheduleDateUtils';

interface DatePickerPopupProps {
  selectedDates: string[];
  onDateSelect: (date: string) => void;
  onDateRemove: (date: string) => void;
  month: string;
  disabled?: boolean;
}

/**
 * Компонент всплывающего календаря для выбора нескольких дат
 * Показывает сетку дней месяца для удобного выбора
 */
const DatePickerPopup: React.FC<DatePickerPopupProps> = ({
  selectedDates,
  onDateSelect,
  onDateRemove,
  month,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  /**
   * Обработчик открытия календаря
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Обработчик закрытия календаря
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Получение информации о выбранном месяце
   */
  const monthInfo = parseMonthYear(month);
  if (!monthInfo) {
    return (
      <Typography color="error" variant="caption">
        Неверный формат месяца
      </Typography>
    );
  }

  const { year, month: monthNumber } = monthInfo;
  const daysInMonth = getDaysInMonthForSchedule(year, monthNumber);

  /**
   * Генерация сетки дней месяца
   */
  const generateDaysGrid = () => {
    const days = [];
    
    // Определяем день недели первого дня месяца
    const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
    const startingDay = firstDayOfMonth.getDay(); // 0 - воскресенье, 1 - понедельник, и т.д.
    
    // Добавляем пустые ячейки для смещения
    for (let i = 0; i < (startingDay === 0 ? 6 : startingDay - 1); i++) {
      days.push(null);
    }

    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${monthNumber.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const date = new Date(year, monthNumber - 1, day);
      const dayOfWeek = date.getDay();
      
      // Определяем, является ли день выходным
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      days.push({
        day,
        dateStr,
        isWeekend,
      });
    }

    return days;
  };

  const daysGrid = generateDaysGrid();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /**
   * Проверка, можно ли выбрать дату
   */
  const canSelectDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    return date >= today;
  };

  /**
   * Получение названия месяца
   */
  const monthName = new Date(year, monthNumber - 1).toLocaleDateString('ru-RU', {
    month: 'long',
  });

  return (
    <Box>
      {/* Кнопка для открытия календаря */}
      <Tooltip title="Открыть календарь для выбора дат">
        <IconButton
          onClick={handleClick}
          disabled={disabled || !month}
          color="primary"
          size="small"
        >
          <CalendarIcon />
        </IconButton>
      </Tooltip>

      {/* Поповер с календарем */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            minWidth: 300,
          },
        }}
      >
        <Box>
          {/* Заголовок с месяцем и годом */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {monthName} {year}
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Заголовки дней недели */}
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <Grid item xs key={day}>
                <Typography
                  variant="caption"
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    display: 'block',
                    color: day === 'Сб' || day === 'Вс' ? 'error.main' : 'text.primary',
                  }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Сетка дней месяца */}
          <Grid container spacing={1}>
            {daysGrid.map((day, index) => (
              <Grid item xs key={index}>
                {day ? (
                  <Button
                    fullWidth
                    size="small"
                    variant={
                      selectedDates.includes(day.dateStr)
                        ? 'contained'
                        : 'outlined'
                    }
                    color={
                      selectedDates.includes(day.dateStr)
                        ? 'primary'
                        : day.isWeekend
                        ? 'error'
                        : 'inherit'
                    }
                    disabled={!canSelectDate(day.dateStr)}
                    onClick={() => {
                      if (selectedDates.includes(day.dateStr)) {
                        onDateRemove(day.dateStr);
                      } else {
                        onDateSelect(day.dateStr);
                      }
                    }}
                    sx={{
                      minWidth: 36,
                      minHeight: 36,
                      p: 0,
                      fontSize: '0.875rem',
                    }}
                  >
                    {day.day}
                  </Button>
                ) : (
                  <Box sx={{ minHeight: 36 }} />
                )}
              </Grid>
            ))}
          </Grid>

          {/* Легенда */}
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              • Красным цветом выделены выходные дни
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              • Неактивные дни — прошедшие даты
            </Typography>
          </Box>
        </Box>
      </Popover>

      {/* Отображение выбранных дат */}
      {selectedDates.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Выбранные даты:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedDates.map((date) => (
              <Chip
                key={date}
                label={formatDateForDisplay(date)}
                size="small"
                onDelete={() => onDateRemove(date)}
                disabled={disabled}
                icon={<EventIcon fontSize="small" />}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DatePickerPopup;