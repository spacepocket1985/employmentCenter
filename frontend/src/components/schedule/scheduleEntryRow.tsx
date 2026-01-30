// components/schedule/ScheduleEntryRow.tsx

import React from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { ScheduleEntryForm } from 'src/types/schedule.types';
import { formatDateForDisplay } from 'src/utils/dateUtils';

interface ScheduleEntryRowProps {
  entry: ScheduleEntryForm;
  index: number;
  onUpdate: (updates: Partial<ScheduleEntryForm>) => void;
  onRemove: () => void;
  onAddDate: (date: string) => void;
  onRemoveDate: (date: string) => void;
  errors?: string[];
  disabled?: boolean;
}

const ScheduleEntryRow: React.FC<ScheduleEntryRowProps> = ({
  entry,
  index,
  onUpdate,
  onRemove,
  onAddDate,
  onRemoveDate,
  errors = [],
  disabled,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ customName: e.target.value });
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ customJob: e.target.value });
  };

  const handleDateKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      onAddDate(e.currentTarget.value);
      e.currentTarget.value = '';
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {index + 1}
          </Typography>
          {entry.isFromTemplate && (
            <Tooltip title="Из шаблона">
              <PersonIcon color="primary" fontSize="small" />
            </Tooltip>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={entry.customName}
          onChange={handleNameChange}
          error={errors.some((e) => e.includes('ФИО'))}
          helperText={errors.find((e) => e.includes('ФИО'))}
          disabled={disabled || entry.isFromTemplate}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                <PersonIcon fontSize="small" color="action" />
              </Box>
            ),
          }}
        />
      </TableCell>

      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={entry.customJob}
          onChange={handleJobChange}
          error={errors.some((e) => e.includes('Должность'))}
          helperText={errors.find((e) => e.includes('Должность'))}
          disabled={disabled || entry.isFromTemplate}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                <WorkIcon fontSize="small" color="action" />
              </Box>
            ),
          }}
        />
      </TableCell>

      <TableCell>
        <Box sx={{ mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Добавить дату (ГГГГ-ММ-ДД)"
            onKeyPress={handleDateKeyPress}
            disabled={disabled}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon fontSize="small" color="action" />
                </Box>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {entry.dates.map((date) => (
            <Chip
              key={date}
              label={formatDateForDisplay(date)}
              size="small"
              onDelete={() => onRemoveDate(date)}
              disabled={disabled}
            />
          ))}
        </Box>

        {errors.some((e) => e.includes('дату')) && (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: 0.5, display: 'block' }}
          >
            {errors.find((e) => e.includes('дату'))}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        <IconButton
          onClick={onRemove}
          disabled={disabled}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ScheduleEntryRow;
