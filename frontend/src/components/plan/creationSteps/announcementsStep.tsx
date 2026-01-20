import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

import { planStylesForCreate } from 'src/const';
import AnnouncementsSelector from '../dataSelectors/announcementsSelector';
import { Announcement } from 'src/types/workPlan.types';

interface AnnouncementsStepProps {
  allDays: Array<{ dayNumber: number; dayOfWeek: string }>;
  announcements: Announcement[];
  isLoading: boolean;
  title?: string;
  onAddAnnouncement: (
    dayNumber: number,
    title: string,
    style?: Announcement['style']
  ) => void;
  onRemoveAnnouncement: (id: string) => void;
}

export const AnnouncementsStep: React.FC<AnnouncementsStepProps> = ({
  allDays,
  announcements,
  isLoading,
  onAddAnnouncement,
  onRemoveAnnouncement,
  title = '4. Добавьте анонсы мероприятий',
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      elevation={3}
    >
      <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
        {title}
      </Typography>
      <Box sx={{ mt: 2, flexGrow: 1 }}>
        <AnnouncementsSelector
          allDays={allDays}
          announcements={announcements}
          onAddAnnouncement={onAddAnnouncement}
          onRemoveAnnouncement={onRemoveAnnouncement}
          disabled={isLoading}
        />
      </Box>
    </Paper>
  );
};
