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
import { ViewWeek, CalendarViewWeek } from '@mui/icons-material';

interface WeekInfo {
  weekNumber: number;
  startDate: string;
  endDate: string;
  monthName: string;
}

interface WeekFilterProps {
  weeks: WeekInfo[];
  filterType: 'all' | 'week';
  selectedWeek: number | null;
  onFilterTypeChange: (type: 'all' | 'week') => void;
  onWeekChange: (weekNumber: number | null) => void;
  currentWeek?: number | null;
}

/**
 * WeekFilter - компонент фильтрации плана по неделям
 *
 * Позволяет пользователю выбирать между просмотром всех недель
 * или просмотром конкретной недели
 */
const WeekFilter: React.FC<WeekFilterProps> = ({
  weeks,
  filterType,
  selectedWeek,
  onFilterTypeChange,
  onWeekChange,
  currentWeek = null,
}) => {
  // Обработчик изменения типа фильтра
  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    value: 'all' | 'week' | null
  ) => {
    if (value !== null) {
      onFilterTypeChange(value);
      // При переключении на "все недели" сбрасываем выбранную неделю
      if (value === 'all') {
        onWeekChange(null);
      }
    }
  };

  // Обработчик выбора недели
  const handleWeekChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    onWeekChange(value);
  };

  // Находим информацию о выбранной неделе
  const selectedWeekInfo = weeks.find(
    (week) => week.weekNumber === selectedWeek
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 3,
        p: 2,
        bgcolor: '#f5f7fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Заголовок фильтра */}
      <Typography
        variant="subtitle1"
        sx={{ mr: 2, fontWeight: 600, color: '#103896' }}
      >
        Просмотр:
      </Typography>

      {/* Переключатель между "все недели" и "выбрать неделю" */}
      <ToggleButtonGroup
        value={filterType}
        exclusive
        onChange={handleFilterChange}
        size="small"
      >
        {/* Кнопка "Все недели" */}
        <ToggleButton
          value="all"
          sx={{
            '&.Mui-selected': {
              bgcolor: '#103896',
              color: 'white',
              '&:hover': {
                bgcolor: '#213c5d',
              },
            },
          }}
        >
          <ViewWeek fontSize="small" sx={{ mr: 1 }} />
          Все недели ({weeks.length})
        </ToggleButton>

        {/* Кнопка "Выбрать неделю" */}
        <ToggleButton
          value="week"
          sx={{
            '&.Mui-selected': {
              bgcolor: '#103896',
              color: 'white',
              '&:hover': {
                bgcolor: '#3a506b',
              },
            },
          }}
        >
          <CalendarViewWeek fontSize="small" sx={{ mr: 1 }} />
          Выбрать неделю
          {/* Показываем индикатор текущей недели, если она есть */}
          {currentWeek && weeks.some((w) => w.weekNumber === currentWeek) && (
            <Chip
              label="Текущая"
              color="primary"
              size="small"
              sx={{
                ml: 1,
                height: 20,
                minWidth: 60,
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            />
          )}
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Выпадающий список для выбора недели */}
      {filterType === 'week' && (
        <FormControl size="small" sx={{ minWidth: 250 }}>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <Select
              value={selectedWeek || ''}
              onChange={handleWeekChange}
              displayEmpty
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            >
              {/* Плейсхолдер, когда неделя не выбрана */}
              <MenuItem value="" disabled>
                Выберите неделю
              </MenuItem>

              {/* Список недель */}
              {weeks.map((week) => {
                const isCurrentWeek = week.weekNumber === currentWeek;
                const isSelected = week.weekNumber === selectedWeek;

                return (
                  <MenuItem key={week.weekNumber} value={week.weekNumber}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      {/* Информация о неделе */}
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        gap={1}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: isSelected ? 600 : 400,
                            color: isCurrentWeek ? '#1976d2' : 'inherit',
                          }}
                        >
                          Неделя {week.weekNumber}
                          {' - '}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {week.startDate} - {week.endDate}
                        </Typography>
                      </Box>

                      {/* Индикатор текущей недели */}
                      {isCurrentWeek && (
                        <Chip
                          label="Текущая"
                          color="primary"
                          size="small"
                          sx={{
                            ml: 1,
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>

            {/* Информация о выбранной неделе */}
            {selectedWeekInfo && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  color: '#546e7a',
                  fontSize: '0.75rem',
                }}
              >
                Выбрана неделя {selectedWeekInfo.weekNumber}:{' '}<br/>
                {selectedWeekInfo.startDate} - {selectedWeekInfo.endDate}
              </Typography>
            )}
          </Box>
        </FormControl>
      )}
    </Box>
  );
};

export default WeekFilter;
