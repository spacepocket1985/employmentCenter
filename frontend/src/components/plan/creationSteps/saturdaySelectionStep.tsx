import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Tooltip,
  Button,
  Alert,
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import ReplayIcon from '@mui/icons-material/Replay';

import { planStylesForCreate } from 'src/const';
import { SaturdayData } from 'src/types/workPlan.types';

interface SaturdaySelectionStepProps {
  saturdays: SaturdayData[];
  workingSaturdays: number[];
  selectedMonthNumber: number;
  isLoading: boolean;
  onSaturdayToggle: (dayNumber: number) => void;
  title?: string;
  mode?: 'create' | 'edit';
  originalSaturdays?: number[];
  hasChanges?: boolean;
  onUpdateSaturdays?: () => void;
  onCancelChanges?: () => void;
}

export const SaturdaySelectionStep: React.FC<SaturdaySelectionStepProps> = ({
  saturdays,
  workingSaturdays,
  isLoading,
  onSaturdayToggle,
  title,
  mode = 'create',
  originalSaturdays = [],
  hasChanges = false,
  onUpdateSaturdays,
  onCancelChanges,
}) => {
  const stepTitle =
    title ||
    (mode === 'create' ? '2. Укажите рабочие субботы' : '1. Рабочие субботы');

  // Определяем, какие субботы изменились
  const changedSaturdays =
    mode === 'edit'
      ? workingSaturdays
          .filter((day) => !originalSaturdays.includes(day))
          .concat(
            originalSaturdays.filter((day) => !workingSaturdays.includes(day))
          )
      : [];

  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
      elevation={3}
    >
      <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
        {stepTitle}
      </Typography>

      {/* Индикатор изменений в режиме редактирования */}
      {mode === 'edit' && hasChanges && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            py: 0.5,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant="body2">
              Изменено суббот: {changedSaturdays.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<ReplayIcon />}
                onClick={onCancelChanges}
                variant="outlined"
                color="inherit"
              >
                Сбросить
              </Button>
              <Button
                size="small"
                startIcon={<UpdateIcon />}
                onClick={onUpdateSaturdays}
                variant="contained"
                color="primary"
              >
                Обновить
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      <Box sx={{ mt: 1, flexGrow: 1 }}>
        {saturdays.length > 0 ? (
          <>
            <Typography variant="body2" color="text.secondary" paragraph>
              {mode === 'create'
                ? 'По умолчанию все субботы нерабочие. Отметьте субботы, которые являются рабочими:'
                : 'Текущие рабочие субботы выделены синим. Изменения подсвечены:'}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {saturdays.map((saturday) => {
                const isWorking = workingSaturdays.includes(saturday.dayNumber);
                const wasWorking = originalSaturdays.includes(
                  saturday.dayNumber
                );
                const hasChanged = mode === 'edit' && isWorking !== wasWorking;

                return (
                  <Tooltip
                    key={saturday.dayNumber}
                    title={
                      mode === 'edit'
                        ? hasChanged
                          ? isWorking
                            ? 'Добавлена (была нерабочей)'
                            : 'Убрана (была рабочей)'
                          : wasWorking
                          ? 'Сохраняется рабочей'
                          : 'Сохраняется нерабочей'
                        : isWorking
                        ? 'Рабочая суббота'
                        : 'Нерабочая суббота'
                    }
                  >
                    <Chip
                      label={`${saturday.dayNumber} (суббота)`}
                      color={
                        isWorking
                          ? hasChanged
                            ? 'success'
                            : 'primary'
                          : hasChanged
                          ? 'error'
                          : 'default'
                      }
                      variant={isWorking || hasChanged ? 'filled' : 'outlined'}
                      onClick={() => onSaturdayToggle(saturday.dayNumber)}
                      clickable
                      disabled={isLoading}
                      size="small"
                      sx={{
                        borderColor: hasChanged
                          ? isWorking
                            ? 'success.main'
                            : 'error.main'
                          : undefined,
                        borderWidth: hasChanged ? 2 : 1,
                        fontWeight: hasChanged ? 600 : 400,
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 'auto',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Всего суббот: {saturdays.length}
              </Typography>

              {mode === 'edit' && (
                <Typography variant="caption" color="text.secondary">
                  Выбрано: {workingSaturdays.length} из {saturdays.length}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Typography color="text.secondary" textAlign="center">
            Нет суббот в выбранном месяце
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
