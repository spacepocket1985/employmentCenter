import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Box,
  Tooltip,
  Divider,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import { LoadingErrorWrapper } from '@components/layout';
import { UITableHead, UICollectionInfo } from '@components/ui';
import { useGetBusRouteQuery } from '@store/slices';
import { busRouteCellTitles } from 'src/const';
import { BusRouteModel } from 'src/types/busRoute.types';

type BusRouteProps = { id: string };

export const BusRoute: React.FC<BusRouteProps> = ({ id }) => {
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetBusRouteQuery(id, {
    skip: !id,
  });

  const busRouteData = data?.data;

  const busRoute: BusRouteModel = busRouteData || {
    _id: '',
    routeNumber: '',
    routeName: '',
    description: '',
    schedules: [],
    isActive: true,
    createdAt: '',
    updatedAt: '',
  };

  const busRouteTitle = `Маршрут №${busRoute.routeNumber} ${
    busRoute.routeName ? `(${busRoute.routeName})` : ''
  }`;

  /**
   * Обработчик перехода к редактированию
   */
  const handleEdit = (): void => {
    navigate(`./${id}`);
  };

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      error={error}
      isCollectionObject={true}
    >
      <Paper sx={{ p: 2 }}>
        {/* Шапка с кнопками навигации */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Tooltip title="Редактировать график">
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              size="medium"
            >
              Редактировать
            </Button>
          </Tooltip>
        </Box>

        {/* Заголовок графика */}
        <Box display={'flex'} alignItems="center" gap={2} mb={2}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {busRouteTitle}
          </Typography>
          <Chip
            label={busRoute.isActive ? 'Активный' : 'Архивный'}
            color={busRoute.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {/* Описание маршрута */}
        {busRoute.description && busRoute.description.trim() && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Описание:</strong> {busRoute.description}
            </Typography>
          </Paper>
        )}

        {/* Расписания */}
        {busRoute.schedules.map((schedule, scheduleIndex) => (
          <Box key={scheduleIndex} sx={{ mb: 4 }}>
            {/* Заголовок расписания */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                p: 1,
                bgcolor:
                  schedule.period === 'morning' ? 'warning.50' : 'primary.50',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="h6"
                color={
                  schedule.period === 'morning'
                    ? 'warning.main'
                    : 'primary.main'
                }
              >
                {getPeriodLabel(schedule.period)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {schedule.dayTypes.map((dayType, index) => (
                  <Chip
                    key={index}
                    label={dayType}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              {schedule.vehicles.map((vehicle, index) => (
                <Chip
                  key={index}
                  label={vehicle.model}
                  size="small"
                  icon={<DirectionsBusIcon />}
                  variant="outlined"
                />
              ))}
            </Box>

            {/* Таблица остановок */}
            <TableContainer>
              <Table size="small">
                <UITableHead cellTitels={busRouteCellTitles} />
                <TableBody>
                  {schedule.busStops.map((busStop) => {
                    // Проверяем, является ли запись специальной отметкой
                    if (isSpecialNote(busStop)) {
                      return (
                        <TableRow key={busStop.orderNumber}>
                          <TableCell colSpan={4} sx={{ p: 0 }}>
                            <Box
                              sx={{
                                p: 2,
                                my: 1,
                                bgcolor: 'warning.50',
                                border: '1px dashed',
                                borderColor: 'warning.main',
                                borderRadius: 1,
                                textAlign: 'center',
                              }}
                            >
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                color="warning.dark"
                              >
                                {busStop.name}
                              </Typography>
                              {extractTime(busStop.time) && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {extractTime(busStop.time)}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    // Обычная остановка
                    return (
                      <TableRow
                        key={busStop.orderNumber}
                        hover
                        sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                      >
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">
                            <Chip label={busStop.orderNumber} size="small" />
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{busStop.name}</TableCell>
                        <TableCell align="left">{busStop.address}</TableCell>
                        <TableCell align="left">
                          {extractTime(busStop.time) || (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontStyle="italic"
                            >
                              Далее по маршруту
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Примечания к расписанию */}
            {schedule.notes && (
              <Paper
                variant="outlined"
                sx={{ p: 1, mt: 2, bgcolor: 'grey.50' }}
              >
                <Typography variant="caption" color="text.secondary">
                  <strong>Примечание:</strong> {schedule.notes}
                </Typography>
              </Paper>
            )}

            {scheduleIndex < busRoute.schedules.length - 1 && (
              <Divider sx={{ my: 3 }} />
            )}
          </Box>
        ))}

        <UICollectionInfo
          collectionTitle="расписания маршрута"
          collectionLength={busRoute.schedules.length}
          onRefetch={refetch}
        />
      </Paper>
    </LoadingErrorWrapper>
  );
};

// Добавляем недостающий импорт
import { DirectionsBus as DirectionsBusIcon } from '@mui/icons-material';
import {
  getPeriodLabel,
  isSpecialNote,
  extractTime,
} from '@utils/busRouteUtils';
