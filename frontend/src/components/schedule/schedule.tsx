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
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import { LoadingErrorWrapper } from '@components/layout';
import { UITableHead, UICollectionInfo } from '@components/ui';
import { useGetScheduleQuery } from '@store/slices';
import { parseScheduleDate } from '@utils/scheduleDateUtils';
import { SCHEDULE_TITLES, scheduleCellTitles } from 'src/const';
import { ScheduleModel, ScheduleTypeEnum } from 'src/types/schedule.types';

type ScheduleProps = { id: string };

export const Schedule: React.FC<ScheduleProps> = ({ id }) => {
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetScheduleQuery(id, {
    skip: !id,
  });

  const scheduleData = data?.data;

  const schedule: ScheduleModel = {
    _id: scheduleData?._id || '',
    month: scheduleData?.month || '',
    scheduleType: scheduleData?.scheduleType || ScheduleTypeEnum.responsibleOnWeekends ,
    entries: scheduleData?.entries || [],
    notes: scheduleData?.notes || '',
    createdAt: scheduleData?.createdAt || '',
    updatedAt: scheduleData?.updatedAt || '',
    isPublished: scheduleData?.isPublished || false,
    createdBy: scheduleData?.createdBy || null,
  };

  const scheduleTitle =
    SCHEDULE_TITLES[schedule.scheduleType]?.fullTitle || 'График';
  const { year, month: monthName } = parseScheduleDate(schedule.month);

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
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          {`${scheduleTitle} на ${monthName}, ${year}.`}
        </Typography>

        {/* Информация о статусе */}
        {schedule.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Примечание: {schedule.notes}
          </Typography>
        )}

        <TableContainer>
          <Table size="small">
            <UITableHead cellTitels={scheduleCellTitles} />
            <TableBody>
              {schedule.entries.map((item) => (
                <TableRow
                  key={item._id}
                  hover
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      <Chip label={item.orderIndex + 1} />
                    </Typography>
                  </TableCell>

                  <TableCell align="left">{item.customName}</TableCell>

                  <TableCell align="left">{item.customJob}</TableCell>

                  <TableCell align="left">
                  {typeof item.employeeId === 'object' && item.employeeId?.department || '-'}
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        justifyContent: 'center',
                      }}
                    >
                      {item.dates.map((date) => (
                        <Chip
                          key={date}
                          label={new Date(date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'numeric',
                          })}
                          size="small"
                        />
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <UICollectionInfo
          collectionTitle="Графики"
          collectionLength={schedule.entries.length}
          onRefetch={refetch}
        />
      </Paper>
    </LoadingErrorWrapper>
  );
};
