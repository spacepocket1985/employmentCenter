import React from 'react';
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { isSpecialNote, extractTime } from '@utils/busRouteUtils';
import { BusRouteModel } from 'src/types/busRoute.types';
import { UITableHead } from '@components/ui/UITableHead';
import { busRouteCellTitles } from '@const/busRoute.const';
import { BusRouteTitle } from './busRouteTitle';
import { BusRouteInfo } from './busRouteInfo';
import { PAPER_STYLES } from '@const/printStyles';

type BusRouteProps = { busRoute: BusRouteModel };

export const BusRoute: React.FC<BusRouteProps> = ({ busRoute }) => {
  const {
    _id: routeId,
    isActive,
    routeNumber,
    routeName,
    updatedAt,
    createdAt,
    schedules,
    description
  } = busRoute;

  return (
    <Paper sx={{ p: 2, ...PAPER_STYLES }}>
      <BusRouteTitle
        isActive={isActive}
        routeName={routeName}
        routeNumber={routeNumber}
        updatedAt={updatedAt}
        createdAt={createdAt}
      />

      {/* Расписания */}
      {schedules.map((schedule, scheduleIndex) => (
        <Box
          key={`schedule-${routeId}-${schedule._id || scheduleIndex}`}
          sx={{ mb: 4 }}
        >
          <BusRouteInfo
            schedule={schedule}
            routeNumber={routeNumber}
            routeName={routeName}
            description={description}
          />

          {/* Таблица остановок */}
          <TableContainer>
            <Table size="small">
              <UITableHead cellTitels={busRouteCellTitles} />
              <TableBody>
                {schedule.busStops.map((busStop, stopIndex) => {
                  const stopKey = `stop-${routeId}-${
                    schedule._id || scheduleIndex
                  }-${busStop.orderNumber}-${stopIndex}`;

                  if (isSpecialNote(busStop)) {
                    return (
                      <TableRow key={stopKey}>
                        <TableCell colSpan={4} sx={{ p: 0 }}>
                          <Box
                            className="special-note"
                            sx={{
                              p: 2,
                              my: 1,
                              bgcolor: 'warning.50',
                              border: '1px dashed',
                              borderColor: 'warning.main',
                              borderRadius: 1,
                              textAlign: 'center',
                              '@media print': {
                                bgcolor: 'white !important',
                                border: '1px dashed #000 !important',
                                color: 'black !important',
                              },
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{
                                '@media print': {
                                  color: 'black !important',
                                },
                              }}
                            >
                              {busStop.name}
                            </Typography>
                            {extractTime(busStop.time) && (
                              <Typography
                                variant="caption"
                                sx={{
                                  '@media print': {
                                    color: 'black !important',
                                  },
                                }}
                              >
                                {extractTime(busStop.time)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return (
                    <TableRow
                      key={stopKey}
                      hover
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                        '@media print': {
                          '&:hover': { bgcolor: 'transparent !important' },
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          <Chip
                            label={busStop.orderNumber}
                            size="small"
                            component={'span'}
                          />
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{busStop.name}</TableCell>
                      <TableCell align="left">{busStop.address}</TableCell>
                      <TableCell align="left">
                        {extractTime(busStop.time) || (
                          <Typography
                            variant="body2"
                            fontStyle="italic"
                            sx={{
                              '@media print': {
                                color: 'black !important',
                                fontStyle: 'italic',
                              },
                            }}
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
              sx={{
                p: 1,
                mt: 2,
                bgcolor: 'grey.50',
                '@media print': {
                  bgcolor: 'white !important',
                  border: '1px solid #000 !important',
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  '@media print': {
                    color: 'black !important',
                  },
                }}
              >
                <strong>Примечание:</strong> {schedule.notes}
              </Typography>
            </Paper>
          )}

          {scheduleIndex < schedules.length - 1 && (
            <Divider
              sx={{
                my: 3,
                '@media print': {
                  borderColor: '#000 !important',
                  backgroundColor: '#000 !important',
                },
              }}
            />
          )}
        </Box>
      ))}
    </Paper>
  );
};
