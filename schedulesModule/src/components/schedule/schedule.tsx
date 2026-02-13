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

type ScheduleProps = { schedule: ScheduleModel };

export const Schedule: React.FC<ScheduleProps> = ({ schedule }) => {
  const scheduleTitle =
    SCHEDULE_TITLES[schedule.scheduleType]?.fullTitle || 'График';
  const { year, month: monthName } = parseScheduleDate(schedule.month);

  return (
    <Paper
      sx={{
        p: 2,
        '@media print': {
          boxShadow: 'none !important',
          border: '1px solid black !important',
        },
      }}
    >
      {/* Заголовок графика */}
      <ScheduleTitle
        year={year}
        monthName={monthName}
        scheduleTitle={scheduleTitle}
      />

      <TableContainer>
        <Table size="small">
          <UITableHead cellTitels={scheduleCellTitles} />
          <TableBody>
            {schedule.entries.map((item) => (
              <TableRow
                key={item._id}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  '@media print': {
                    '&:hover': {
                      bgcolor: 'transparent !important',
                    },
                  },
                }}
              >
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      backgroundColor: '#f0f0f0',
                      padding: '4px 8px',
                      borderRadius: '16px',
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

                <TableCell align="left">
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

                <TableCell align="left">
                  <Box component="span">{item.customJob}</Box>
                </TableCell>

                <TableCell align="left">
                  <Box component="span">
                    {(typeof item.employeeId === 'object' &&
                      item.employeeId?.department) ||
                      '-'}
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      justifyContent: 'center',
                      '@media print': {
                        gap: '2px',
                      },
                    }}
                  >
                    {item.dates.map((date) => (
                      <Chip
                        key={date}
                        label={new Date(date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                        })}
                        sx={CHIP_STYLES}
                      />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
