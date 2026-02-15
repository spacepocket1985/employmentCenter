import React from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
} from '@mui/material';
import { ScheduleModel } from 'src/types/schedule.types';
import { SCHEDULE_TITLES, scheduleCellTitles } from '@const/schedule.consts';
import { parseScheduleDate } from '@utils/scheduleDateUtils';
import { ScheduleTitle } from './scheduleTitle';
import { CHIP_STYLES } from '@const/printStyles';
import { UITableHead } from '@components/ui/UITableHead';

type ScheduleProps = {
  schedule: ScheduleModel;
  compactMode?: boolean; // новый пропс
};

export const Schedule: React.FC<ScheduleProps> = ({
  schedule,
  compactMode = false,
}) => {
  const scheduleTitle =
    SCHEDULE_TITLES[schedule.scheduleType]?.fullTitle || 'График';
  const { year, month: monthName } = parseScheduleDate(schedule.month);

  // Базовые стили для компактного режима
  const paperStyles = {
    p: compactMode ? 1 : 2,
    '@media print': {
      boxShadow: 'none !important',
      border: 'none !important',
    },
  };

  // Стили для ячеек в компактном режиме
  const cellStyles = compactMode
    ? {
        py: 0.5,
        px: 0.5,
        fontSize: '0.75rem',
      }
    : {};

  // Функция для рендера дат: в компактном режиме показываем через запятую, иначе чипы
  const renderDates = (dates: string[]) => {
    if (compactMode) {
      // Показываем даты как обычный текст через запятую
      const days = dates
        .map((date) =>
          new Date(date).toLocaleDateString('ru-RU', { day: 'numeric' })
        )
        .join(', ');
      return <Box sx={{ fontSize: '0.75rem' }}>{days}</Box>;
    }
    // Обычный режим: чипы
    return (
      <Box
        sx={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          gap: 0.5,
          justifyContent: 'center',
          '@media print': { gap: '2px' },
        }}
      >
        {dates.map((date) => (
          <Chip
            key={date}
            label={new Date(date).toLocaleDateString('ru-RU', {
              day: 'numeric',
            })}
            sx={CHIP_STYLES}
          />
        ))}
      </Box>
    );
  };

  return (
    <Paper sx={paperStyles}>
      <ScheduleTitle
        year={year}
        monthName={monthName}
        scheduleTitle={scheduleTitle}
        compactMode={compactMode}
      />

      <TableContainer>
        <Table size={'small'}>
          <UITableHead
            cellTitels={scheduleCellTitles}
            compactMode={compactMode}
          />
          <TableBody>
            {schedule.entries.map((item) => (
              <TableRow
                key={item._id}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  '@media print': {
                    '&:hover': { bgcolor: 'transparent !important' },
                  },
                }}
              >
                {/* Номер */}
                <TableCell sx={cellStyles}>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      backgroundColor: compactMode ? 'transparent' : '#f0f0f0',
                      padding: compactMode ? 0 : '4px 8px',
                      borderRadius: compactMode ? 0 : '16px',
                      '@media print': {
                        background: 'none !important',
                        padding: '0 !important',
                        borderRadius: '0 !important',
                      },
                    }}
                  >
                    {item.orderIndex + 1}
                  </Box>
                </TableCell>

                {/* Имя */}
                <TableCell align="left" sx={cellStyles}>
                  <Box
                    component="span"
                    sx={{
                      color: 'rgb(16, 56, 150)',
                      '@media print': {
                        color: 'black !important',
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    {item.customName}
                  </Box>
                </TableCell>

                {/* Должность */}
                <TableCell align="left" sx={cellStyles}>
                  <Box component="span">{item.customJob}</Box>
                </TableCell>

                {/* Отдел */}
                <TableCell align="left" sx={cellStyles}>
                  <Box component="span">
                    {(typeof item.employeeId === 'object' &&
                      item.employeeId?.department) ||
                      '-'}
                  </Box>
                </TableCell>

                {/* Даты */}
                <TableCell align="center" sx={cellStyles}>
                  {renderDates(item.dates)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
