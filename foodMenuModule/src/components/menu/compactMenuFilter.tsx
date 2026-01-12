// components/CompactMenuFilter.tsx
import React from 'react';
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
  // Обработчик изменения типа фильтра
  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    value: 'all' | 'day' | null
  ) => {
    if (value !== null) {
      onFilterTypeChange(value);
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
        </ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          value={selectedDate || ''}
          onChange={handleDateChange}
          disabled={filterType === 'all'}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) return 'Выберите дату';
            const day = menu.find(d => d.date === selected);
            if (!day) return selected;
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{day.date.split(' ')[0]}</span>
                {isToday(selected) && (
                  <Chip label="Сегодня" color="primary" size="small" />
                )}
              </Box>
            );
          }}
        >
          {menu.map((day) => (
            <MenuItem key={day.date} value={day.date}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>{day.date} — {day.dayOfWeek}</span>
                {isToday(day.date) && (
                  <Chip label="Сегодня" color="primary" size="small" />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CompactMenuFilter;