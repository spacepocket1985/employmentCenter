import React from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import {
  Route as RouteIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

interface RouteInfo {
  routeNumber: string;
  routeName?: string;
  routeId: string;
}

interface RouteFilterProps {
  routes: RouteInfo[]; // Список всех доступных маршрутов
  filterType: 'all' | 'route'; // Тип фильтра: все или конкретный маршрут
  selectedRoute: string | null; // ID выбранного маршрута
  onFilterTypeChange: (type: 'all' | 'route') => void; // Изменение типа фильтра
  onRouteChange: (routeId: string | null) => void; // Изменение выбранного маршрута
}

/**
 * RouteFilter - компонент фильтрации маршрутов
 *
 * Позволяет пользователю выбирать между просмотром всех маршрутов
 * или просмотром конкретного маршрута по его номеру/названию
 */
const RouteFilter: React.FC<RouteFilterProps> = ({
  routes,
  filterType,
  selectedRoute,
  onFilterTypeChange,
  onRouteChange,
}) => {
  // Обработчик изменения типа фильтра
  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    value: 'all' | 'route' | null
  ) => {
    if (value !== null) {
      onFilterTypeChange(value);
      // При переключении на "все маршруты" сбрасываем выбранный маршрут
      if (value === 'all') {
        onRouteChange(null);
      }
    }
  };

  // Обработчик выбора маршрута
  const handleRouteChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    onRouteChange(value);
  };

  // Находим информацию о выбранном маршруте
  const selectedRouteInfo = routes.find(
    (route) => route.routeId === selectedRoute
  );

  return (
    <Box
    className="no-print"
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
        Фильтр:
      </Typography>

      {/* Переключатель между "все маршруты" и "выбрать маршрут" */}
      <ToggleButtonGroup
        value={filterType}
        exclusive
        onChange={handleFilterChange}
        size="small"
      >
        {/* Кнопка "Все маршруты" */}
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
          <FilterListIcon fontSize="small" sx={{ mr: 1 }} />
          Все маршруты ({routes.length})
        </ToggleButton>

        {/* Кнопка "Выбрать маршрут" */}
        <ToggleButton
          value="route"
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
          <RouteIcon fontSize="small" sx={{ mr: 1 }} />
          Выбрать маршрут
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Выпадающий список для выбора маршрута */}
      {filterType === 'route' && (
        <FormControl size="small" sx={{ minWidth: 300 }}>
          <Box display={'flex'} gap={1} alignItems={'center'}>
            <Select
              value={selectedRoute || ''}
              onChange={handleRouteChange}
              displayEmpty
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            >
              {/* Плейсхолдер, когда маршрут не выбран */}
              <MenuItem value="" disabled>
                Выберите маршрут
              </MenuItem>

              {/* Список маршрутов */}
              {routes.map((route) => {
                const isSelected = route.routeId === selectedRoute;

                return (
                  <MenuItem key={route.routeId} value={route.routeId}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      {/* Информация о маршруте */}
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        gap={1}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isSelected ? 600 : 400,
                          }}
                        >
                          Маршрут №{route.routeNumber}
                        </Typography>
                        {route.routeName && (
                          <Typography variant="caption" color="text.secondary">
                            ({route.routeName})
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>

            {/* Информация о выбранном маршруте */}
            {selectedRouteInfo && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: '#546e7a',
                  fontSize: '0.75rem',
                }}
              >
                Выбран маршрут №{selectedRouteInfo.routeNumber}
                {selectedRouteInfo.routeName &&
                  ` (${selectedRouteInfo.routeName})`}
              </Typography>
            )}
          </Box>
        </FormControl>
      )}
    </Box>
  );
};

export default RouteFilter;
