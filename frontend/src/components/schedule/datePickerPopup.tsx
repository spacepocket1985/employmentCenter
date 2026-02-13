import React, { useState } from 'react';
import {
  Box,
  Popover,
  IconButton,
  Typography,
  Button,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import {
  getDaysInMonthForSchedule,
  parseMonthYear,
} from '@utils/scheduleDateUtils';

interface DatePickerPopupProps {
  /** Выбранные даты */
  selectedDates: string[];
  /** Обработчик выбора даты */
  onDateSelect: (date: string) => void;
  /** Обработчик удаления даты */
  onDateRemove: (date: string) => void;
  /** Месяц для отображения (формат: YYYY-MM) */
  month: string;
  /** Отключенное состояние */
  disabled?: boolean;
}

interface DayInfo {
  day: number;
  dateStr: string;
  isWeekend: boolean;
}

/**
 * Компонент всплывающего календаря для выбора нескольких дат
 */
const DatePickerPopup: React.FC<DatePickerPopupProps> = ({
  selectedDates,
  onDateSelect,
  onDateRemove,
  month,
  disabled = false,
}): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open: boolean = Boolean(anchorEl);

  /**
   * Обработчик открытия календаря
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Обработчик закрытия календаря
   */
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const monthInfo = parseMonthYear(month);

  if (!monthInfo) {
    return (
      <Typography color="error" variant="caption">
        Неверный формат месяца
      </Typography>
    );
  }

  const { year, month: monthNumber } = monthInfo;
  const daysInMonth: number = getDaysInMonthForSchedule(year, monthNumber);

  /**
   * Генерация сетки дней месяца
   */
  const generateDaysGrid = (): (DayInfo | null)[] => {
    const days: (DayInfo | null)[] = [];

    const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
    const startingDay: number = firstDayOfMonth.getDay();

    const offset: number = startingDay === 0 ? 6 : startingDay - 1;
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr: string = `${year}-${monthNumber
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const date = new Date(year, monthNumber - 1, day);
      const dayOfWeek: number = date.getDay();

      const isWeekend: boolean = dayOfWeek === 0 || dayOfWeek === 6;

      days.push({
        day,
        dateStr,
        isWeekend,
      });
    }

    return days;
  };

  const daysGrid: (DayInfo | null)[] = generateDaysGrid();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /**
   * Проверка, можно ли выбрать дату
   */
  // const canSelectDate = (dateStr: string): boolean => {
  //   const date = new Date(dateStr);
  //   return date >= today;
  // };

  const monthName: string = new Date(year, monthNumber - 1).toLocaleDateString(
    'ru-RU',
    {
      month: 'long',
    }
  );

  return (
    <Box>
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">
              {monthName} {year}
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={1} sx={{ mb: 1 }}>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <Grid item xs key={day}>
                <Typography
                  variant="caption"
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    display: 'block',
                    color:
                      day === 'Сб' || day === 'Вс'
                        ? 'error.main'
                        : 'text.primary',
                  }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

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
                    
                    onClick={(): void => {
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

          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              • Красным цветом выделены выходные дни
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              • Неактивные дни — прошедшие даты
            </Typography>
          </Box>
        </Box>
      </Popover>

      {selectedDates.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.5 }}
          >
            Выбранные даты:
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DatePickerPopup;
