import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Paper,
  Alert,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { WorkPlanEditor } from '@components/plan/workPlanEditor';
import { useGetWorkPlanByIdQuery } from '@store/slices';

const SchedulePAge: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: planData,
    isLoading,
    isError,
    error,
  } = useGetWorkPlanByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ mb: 2 }}>
          Ошибка загрузки плана
        </Alert>
        <Typography color="error">
          {error && 'message' in error ? error.message : 'Неизвестная ошибка'}
        </Typography>
      </Container>
    );
  }

  if (!id || !planData?.data) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <ErrorOutlineIcon
            sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            План не найден
          </Typography>
          <Typography color="text.secondary">
            Запрашиваемый план мероприятий не существует или был удален.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const initialData = {
    monthNumber: planData.data.monthNumber,
    year: planData.data.year,
    days: planData.data.days,
    announcements: planData.data.announcements || [],
    workingSaturdays: planData.data.workingSaturdays || [],
  };

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <WorkPlanEditor planId={id} initialData={initialData} />
    </Container>
  );
};

export default SchedulePAge;
