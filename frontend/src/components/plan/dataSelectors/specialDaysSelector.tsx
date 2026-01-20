import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface DayInfo {
  dayNumber: number;
  dayOfWeek: string;
}

interface SpecialDay {
  id: string;
  dayNumber: number;
  title: string;
  dayOfWeek: string;
}

interface SpecialDaysSelectorProps {
  allDays: DayInfo[];
  specialDays: SpecialDay[];
  selectedMonthNumber: number;
  onAddSpecialDay: (dayNumber: number, title: string) => void;
  onRemoveSpecialDay: (id: string) => void;
  disabled?: boolean;
}

export const SpecialDaysSelector: React.FC<SpecialDaysSelectorProps> = ({
  allDays,
  specialDays,
  onAddSpecialDay,
  onRemoveSpecialDay,
  disabled = false,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [specialTitle, setSpecialTitle] = useState('');

  const handleOpenDialog = () => {
    setOpenDialog(true);
    // Установить первый доступный день месяца по умолчанию
    if (availableDays.length > 0) {
      setSelectedDay(availableDays[0].dayNumber);
    } else {
      setSelectedDay(1);
    }
    setSpecialTitle('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDay(1);
    setSpecialTitle('');
  };

  const handleAddSpecialDay = () => {
    if (specialTitle.trim()) {
      onAddSpecialDay(selectedDay, specialTitle.trim());
      handleCloseDialog();
    }
  };

  const handleDayChange = (event: SelectChangeEvent<number>) => {
    setSelectedDay(Number(event.target.value));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialTitle(event.target.value);
  };

  // Получаем доступные дни (те, которые еще не выбраны как специальные)
  const availableDays = allDays.filter(
    (day) => !specialDays.some((special) => special.dayNumber === day.dayNumber)
  );

  // Проверяем, можно ли добавлять новые специальные дни
  const canAddSpecialDays = availableDays.length > 0 && !disabled;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Добавьте специальные мероприятия, которые будут выделены в плане:
      </Typography>

      {/* Список выбранных специальных дней */}
      {specialDays.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {specialDays.map((specialDay) => (
              <Chip
                key={specialDay.id}
                label={`${specialDay.dayNumber}: ${specialDay.title.substring(
                  0,
                  30
                )}${specialDay.title.length > 30 ? '...' : ''}`}
                onDelete={() => onRemoveSpecialDay(specialDay.id)}
                color="warning"
                variant="outlined"
                size="small"
                deleteIcon={<DeleteIcon />}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Всего специальных дней: {specialDays.length}
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, fontStyle: 'italic' }}
        >
          Специальные дни не добавлены
        </Typography>
      )}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
        disabled={!canAddSpecialDays}
      >
        Добавить специальный день
      </Button>

      {/* Диалог добавления специального дня */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить специальный день</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>День месяца</InputLabel>
                <Select
                  value={selectedDay}
                  label="День месяца"
                  onChange={handleDayChange}
                  disabled={availableDays.length === 0}
                >
                  {availableDays.map((day) => (
                    <MenuItem key={day.dayNumber} value={day.dayNumber}>
                      {day.dayNumber} ({day.dayOfWeek})
                    </MenuItem>
                  ))}
                  {availableDays.length === 0 && (
                    <MenuItem disabled>Нет доступных дней</MenuItem>
                  )}
                </Select>
              </FormControl>
              {availableDays.length === 0 && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  Все дни уже имеют специальные мероприятия
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Название специального мероприятия"
                value={specialTitle}
                onChange={handleTitleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Например: ОБЛАСТНАЯ НЕДЕЛЯ НУЛЕВОГО ТРАВМАТИЗМА"
                disabled={availableDays.length === 0}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            onClick={handleAddSpecialDay}
            variant="contained"
            disabled={!specialTitle.trim() || availableDays.length === 0}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
