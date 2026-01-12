import React, { useEffect } from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { CalendarToday, ViewWeek } from '@mui/icons-material';
import { DayMenu } from 'src/types/menu.types';

interface CompactMenuFilterProps {
  menu: DayMenu[];
  filterType: 'all' | 'day';
  selectedDate: string | null;
  onFilterTypeChange: (type: 'all' | 'day') => void;
  onDateChange: (date: string | null) => void;
  isToday: (dateString: string) => boolean;
}

const CompactMenuFilter: React.FC<CompactMenuFilterProps> = ({
  menu,
  filterType,
  selectedDate,
  onFilterTypeChange,
  onDateChange,
  isToday,
}) => {
  // Автоматически выбираем сегодняшний день при загрузке, если он есть в меню
  useEffect(() => {
    if (menu.length > 0 && !selectedDate) {
      const todayMenu = menu.find(day => isToday(day.date));
      
      if (todayMenu) {
        // Если нашли сегодняшний день в меню, выбираем его
        onFilterTypeChange('day');
        onDateChange(todayMenu.date);
      } else {
        // Если сегодняшнего дня нет в меню, показываем все дни
        onFilterTypeChange('all');
      }
    }
  }, [menu, isToday, selectedDate, onFilterTypeChange, onDateChange]);

  // Проверяем, есть ли сегодняшний день в меню
  const hasTodayInMenu = menu.some(day => isToday(day.date));

  // Обработчик изменения типа фильтра
  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    value: 'all' | 'day' | null
  ) => {
    if (value !== null) {
      onFilterTypeChange(value);
      
      // Если переключаемся на "все дни", сбрасываем выбранную дату
      if (value === 'all') {
        onDateChange(null);
      } else if (value === 'day' && !selectedDate) {
        // Если переключаемся на "выбрать день" и дата не выбрана,
        // пытаемся выбрать сегодняшний день
        const todayMenu = menu.find(day => isToday(day.date));
        if (todayMenu) {
          onDateChange(todayMenu.date);
        }
      }
    }
  };

  // Обработчик выбора даты
  const handleDateChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    onDateChange(value || null);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      gap: 2, 
      alignItems: { xs: 'stretch', sm: 'center' },
      mb: 3 
    }}>
      <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 600 }}>
        Показать:
      </Typography>
      
      <ToggleButtonGroup
        value={filterType}
        exclusive
        onChange={handleFilterChange}
        size="small"
      >
        <ToggleButton value="all">
          <ViewWeek fontSize="small" sx={{ mr: 1 }} />
          Все дни ({menu.length})
        </ToggleButton>
        <ToggleButton value="day">
          <CalendarToday fontSize="small" sx={{ mr: 1 }} />
          Выбрать день
          {hasTodayInMenu && (
            <Chip 
              label="!" 
              color="primary" 
              size="small" 
              sx={{ 
                ml: 1, 
                height: 18, 
                minWidth: 18,
                fontSize: '0.7rem',
                backgroundColor: filterType === 'day' && selectedDate && isToday(selectedDate) 
                  ? '#1976d2' 
                  : 'transparent',
                color: filterType === 'day' && selectedDate && isToday(selectedDate) 
                  ? 'white' 
                  : '#1976d2',
                borderColor: '#1976d2'
              }}
            />
          )}
        </ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          value={selectedDate || ''}
          onChange={handleDateChange}
          disabled={filterType === 'all'}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Выберите дату</span>
                  {hasTodayInMenu && filterType === 'day' && (
                    <Chip 
                      label="Сегодня доступно" 
                      color="success" 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                </Box>
              );
            }
            const day = menu.find(d => d.date === selected);
            if (!day) return selected;
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{day.date.split(' ')[0]}</span>
                {isToday(selected) && (
                  <Chip 
                    label={filterType === 'day' && selectedDate === selected ? "Сегодня (авто)" : "Сегодня"} 
                    color="primary" 
                    size="small" 
                  />
                )}
              </Box>
            );
          }}
        >
          {menu.map((day) => {
            const isTodayDate = isToday(day.date);
            return (
              <MenuItem key={day.date} value={day.date}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  width: '100%' 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{day.date.split(' ')[0]}</span>
                    <Typography variant="body2" color="text.secondary">
                      ({day.dayOfWeek})
                    </Typography>
                  </Box>
                  {isTodayDate && (
                    <Chip 
                      label="Сегодня" 
                      color="primary" 
                      size="small" 
                      sx={{ 
                        backgroundColor: selectedDate === day.date ? '#1976d2' : undefined,
                        color: selectedDate === day.date ? 'white' : undefined
                      }}
                    />
                  )}
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CompactMenuFilter;