import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Chip,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { CalendarToday, ViewWeek } from '@mui/icons-material';
import { DayMenu } from 'src/types/menu.types';

interface MenuFilterProps {
  menu: DayMenu[];
  filterType: 'all' | 'day';
  selectedDate: string | null;
  onFilterTypeChange: (type: 'all' | 'day') => void;
  onDateChange: (date: string | null) => void;
  isToday: (dateString: string) => boolean;
}

const MenuFilter: React.FC<MenuFilterProps> = ({
  menu,
  filterType,
  selectedDate,
  onFilterTypeChange,
  onDateChange,
  isToday,
}) => {
  // Обработчик изменения типа фильтра
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as 'all' | 'day';
    onFilterTypeChange(value);
  };

  // Обработчик выбора даты
  const handleDateChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    onDateChange(value || null);
  };

  // Получаем отформатированную выбранную дату для отображения
  const getSelectedDateDisplay = () => {
    if (!selectedDate) return 'Выберите дату';

    const selectedDay = menu.find((d) => d.date === selectedDate);
    if (selectedDay) {
      const isTodayDate = isToday(selectedDate);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>
            {selectedDay.date} — {selectedDay.dayOfWeek}
          </span>
          {isTodayDate && <Chip label="Сегодня" color="primary" size="small" />}
        </Box>
      );
    }
    return selectedDate;
  };

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#103896' }}>
        Фильтр меню
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Тип фильтра */}
        <FormControl sx={{ minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Показывать:
          </Typography>
          <RadioGroup value={filterType} onChange={handleFilterChange}>
            <FormControlLabel
              value="all"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ViewWeek fontSize="small" />
                  <span>Все дни ({menu.length})</span>
                </Box>
              }
            />
            <FormControlLabel
              value="day"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" />
                  <span>Выбрать день</span>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {/* Выбор даты */}
        <FormControl sx={{ minWidth: 250 }} disabled={filterType === 'all'}>
          <Typography variant="subtitle2" gutterBottom>
            {filterType === 'day'
              ? 'Выберите дату:'
              : 'Доступно после выбора "Выбрать день"'}
          </Typography>
          <Select
            value={selectedDate || ''}
            onChange={handleDateChange}
            displayEmpty
            renderValue={() => getSelectedDateDisplay()}
            disabled={filterType === 'all'}
          >
            <MenuItem value="">
              <em>Все доступные даты</em>
            </MenuItem>
            {menu.map((day) => (
              <MenuItem key={day.date} value={day.date}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Box>
                    {day.date} — {day.dayOfWeek}
                  </Box>
                  {isToday(day.date) && (
                    <Chip label="Сегодня" color="primary" size="small" />
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Информация о выбранном фильтре */}
      <Box sx={{ mt: 2 }}>
        {filterType === 'all' ? (
          <Alert severity="info" sx={{ py: 0.5 }}>
            Показывается полное меню на все дни ({menu.length} дней)
          </Alert>
        ) : selectedDate ? (
          <Alert severity="info" sx={{ py: 0.5 }}>
            Показывается меню на выбранный день
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ py: 0.5 }}>
            Выберите дату для отображения меню на конкретный день
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default MenuFilter;
