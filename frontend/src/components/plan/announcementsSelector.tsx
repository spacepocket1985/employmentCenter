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
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnnouncementIcon from '@mui/icons-material/Announcement';

interface DayInfo {
  dayNumber: number;
  dayOfWeek: string;
}

interface Announcement {
  id: string;
  dayNumber: number;
  title: string;
  style?: 'warning' | 'info' | 'success' | 'primary';
  order?: number;
}

interface AnnouncementsSelectorProps {
  allDays: DayInfo[];
  announcements: Announcement[];
  onAddAnnouncement: (
    dayNumber: number,
    title: string,
    style?: Announcement['style']
  ) => void;
  onRemoveAnnouncement: (id: string) => void;
  disabled?: boolean;
}

const AnnouncementsSelector: React.FC<AnnouncementsSelectorProps> = ({
  allDays,
  announcements,
  onAddAnnouncement,
  onRemoveAnnouncement,
  disabled = false,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [selectedStyle, setSelectedStyle] =
    useState<Announcement['style']>('info');

  const handleOpenDialog = () => {
    setOpenDialog(true);
    // Установить первый день месяца по умолчанию
    if (allDays.length > 0) {
      setSelectedDay(allDays[0].dayNumber);
    }
    setAnnouncementTitle('');
    setSelectedStyle('info');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDay(1);
    setAnnouncementTitle('');
    setSelectedStyle('info');
  };

  const handleAddAnnouncement = () => {
    if (announcementTitle.trim()) {
      onAddAnnouncement(selectedDay, announcementTitle.trim(), selectedStyle);
      handleCloseDialog();
    }
  };

  const handleDayChange = (event: SelectChangeEvent<number>) => {
    setSelectedDay(Number(event.target.value));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnnouncementTitle(event.target.value);
  };

  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStyle(event.target.value as Announcement['style']);
  };

  // Получаем доступные дни (все дни месяца)
  const availableDays = allDays;

  const getStyleIcon = (style: Announcement['style']) => {
    switch (style) {
      case 'warning':
        return <WarningIcon />;
      case 'success':
        return <CheckCircleIcon />;
      case 'primary':
        return <AnnouncementIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getStyleColor = (style: Announcement['style']) => {
    switch (style) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'primary':
        return 'primary';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Добавьте анонсы мероприятий, которые будут отображаться перед
        соответствующими днями:
      </Typography>

      {/* Список выбранных анонсов */}
      {announcements.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {announcements.map((announcement) => {
              return (
                <Chip
                  key={announcement.id}
                  label={`${
                    announcement.dayNumber
                  }: ${announcement.title.substring(0, 30)}${
                    announcement.title.length > 30 ? '...' : ''
                  }`}
                  onDelete={() => onRemoveAnnouncement(announcement.id)}
                  color={getStyleColor(announcement.style)}
                  variant="outlined"
                  size="small"
                  deleteIcon={<DeleteIcon />}
                  icon={getStyleIcon(announcement.style)}
                />
              );
            })}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Всего анонсов: {announcements.length}
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, fontStyle: 'italic' }}
        >
          Анонсы не добавлены
        </Typography>
      )}

      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
        disabled={disabled}
      >
        Добавить анонс мероприятия
      </Button>

      {/* Диалог добавления анонса */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить анонс мероприятия</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>День месяца</InputLabel>
                <Select
                  value={selectedDay}
                  label="День месяца"
                  onChange={handleDayChange}
                >
                  {availableDays.map((day) => (
                    <MenuItem key={day.dayNumber} value={day.dayNumber}>
                      {day.dayNumber} ({day.dayOfWeek})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Текст анонса"
                value={announcementTitle}
                onChange={handleTitleChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Например: Неделя охраны труда"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Стиль отображения:
              </Typography>
              <RadioGroup
                row
                value={selectedStyle}
                onChange={handleStyleChange}
              >
                <FormControlLabel
                  value="info"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InfoIcon fontSize="small" />
                      <Typography variant="body2">Информационный</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="warning"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WarningIcon fontSize="small" />
                      <Typography variant="body2">Предупреждение</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="success"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">Успех</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="primary"
                  control={<Radio size="small" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AnnouncementIcon fontSize="small" />
                      <Typography variant="body2">Основной</Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            onClick={handleAddAnnouncement}
            variant="contained"
            disabled={!announcementTitle.trim()}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementsSelector;
