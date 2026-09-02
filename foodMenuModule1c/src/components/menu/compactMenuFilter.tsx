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
import { TFoodMenuDayResponse } from 'src/types/foodMenu.types';


// === ИНТЕРФЕЙС ПРОПСОВ ===
// Компонент получает все данные и обработчики от родителя
interface CompactMenuFilterProps {
  menu: TFoodMenuDayResponse[];
  filterType: 'all' | 'day';
  selectedDate: string | null;
  onFilterTypeChange: (type: 'all' | 'day') => void;
  onDateChange: (date: string | null) => void;
  isToday: (dateString: string) => boolean;
}

/**
 * CompactMenuFilter - компонент фильтрации меню
 * 
 * Этот компонент НЕ управляет состоянием самостоятельно.
 * Он только отображает текущее состояние и вызывает колбэки,
 * переданные из родительского компонента.
 * 
 * Принцип работы:
 * 1. Получает текущие значения filterType и selectedDate
 * 2. При взаимодействии пользователя вызывает onFilterTypeChange или onDateChange
 * 3. Родительский компонент обновляет состояние и передает новые значения обратно
 */
const CompactMenuFilter: React.FC<CompactMenuFilterProps> = ({
  menu,
  filterType,
  selectedDate,
  onFilterTypeChange,
  onDateChange,
  isToday,
}) => {
  // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
  
  /**
   * Проверяет, есть ли сегодняшний день в меню
   * Используется для отображения индикатора "!"
   */
  const hasTodayInMenu = menu.some(day => isToday(day.date));
  
  /**
   * Проверяет, выбран ли сегодняшний день
   * Используется для стилизации чипа
   */
  const isSelectedToday = selectedDate ? isToday(selectedDate) : false;

  // === ОБРАБОТЧИКИ СОБЫТИЙ ===
  
  /**
   * Обработчик изменения типа фильтра (переключение между "все дни" и "выбрать день")
   */
  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    value: 'all' | 'day' | null
  ) => {
    // value может быть null, если нажата уже выбранная кнопка
    if (value !== null) {
      // Вызываем колбэк, переданный из родительского компонента
      onFilterTypeChange(value);
    }
  };

  /**
   * Обработчик выбора даты из выпадающего списка
   */
  const handleDateChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    // Передаем выбранную дату (или null если строка пустая) в родительский компонент
    onDateChange(value || null);
  };

  // === РЕНДЕРИНГ КОМПОНЕНТА ===

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      gap: 2, 
      alignItems: { xs: 'stretch', sm: 'center' },
      mb: 3 
    }}>
      {/* Заголовок фильтра */}
      <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 600 }}>
        Показать:
      </Typography>
      
      {/* Переключатель между "все дни" и "выбрать день" */}
      <ToggleButtonGroup
        value={filterType} // Текущее значение из пропсов
        exclusive // Только одна кнопка может быть выбрана
        onChange={handleFilterChange} // Обработчик изменений
        size="small"
      >
        {/* Кнопка "Все дни" */}
        <ToggleButton value="all">
          <ViewWeek fontSize="small" sx={{ mr: 1 }} />
          Все дни ({menu.length})
        </ToggleButton>
        
        {/* Кнопка "Выбрать день" */}
        <ToggleButton value="day">
          <CalendarToday fontSize="small" sx={{ mr: 1 }} />
          Выбрать день
          {/* Индикатор "!", если сегодняшний день есть в меню */}
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
                // Стилизуем чип, если выбран сегодняшний день
                backgroundColor: filterType === 'day' && isSelectedToday
                  ? '#1976d2' 
                  : 'transparent',
                color: filterType === 'day' && isSelectedToday
                  ? 'white' 
                  : '#1976d2',
                borderColor: '#1976d2'
              }}
            />
          )}
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Выпадающий список для выбора даты */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          value={selectedDate || ''} // Текущее значение из пропсов
          onChange={handleDateChange} // Обработчик изменений
          disabled={filterType === 'all'} // Отключаем, если выбран режим "все дни"
          displayEmpty // Показываем плейсхолдер, когда значение пустое
          // Кастомизация отображаемого значения
          renderValue={(selected) => {
            if (!selected) {
              // Если дата не выбрана, показываем плейсхолдер
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Выберите дату</span>
                  {/* Индикатор "Сегодня доступно", если сегодняшний день есть в меню */}
                  {hasTodayInMenu && filterType === 'day' && !selectedDate && (
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
            
            // Если дата выбрана, находим соответствующий день в меню
            const day = menu.find(d => d.date === selected);
            if (!day) return selected; // На всякий случай
            
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{day.date.split(' ')[0]}</span> {/* Только дата без дня недели */}
                {/* Индикатор "Сегодня", если выбрана сегодняшняя дата */}
                {isToday(selected) && (
                  <Chip 
                    label="Сегодня" 
                    color="primary" 
                    size="small" 
                  />
                )}
              </Box>
            );
          }}
        >
          {/* Пункты меню для каждой даты */}
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
                  {/* Дата и день недели */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{day.date.split(' ')[0]}</span>
                    <Typography variant="body2" color="text.secondary">
                      ({day.dayOfWeek})
                    </Typography>
                  </Box>
                  
                  {/* Индикатор "Сегодня" для соответствующей даты */}
                  {isTodayDate && (
                    <Chip 
                      label="Сегодня" 
                      color="primary" 
                      size="small" 
                      sx={{ 
                        // Выделяем, если эта дата выбрана
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