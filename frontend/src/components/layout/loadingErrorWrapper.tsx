import React from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface LoadingErrorWrapperProps {
  isLoading: boolean;
  error?: unknown;
  children: React.ReactNode;
  onRetry?: () => void;
  isCollectionObject?: boolean;
  collectionLength?: number;
  collectionTitle?: string;
}

export const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  isLoading,
  error,
  children,
  onRetry,
  isCollectionObject = false,
  collectionLength,
  collectionTitle = ' ничего',
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Произошла ошибка';

    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button
                color="inherit"
                size="small"
                onClick={onRetry}
                startIcon={<RefreshIcon />}
              >
                Повторить
              </Button>
            )
          }
        >
          <AlertTitle>Ошибка</AlertTitle>
          {errorMessage}
        </Alert>
      </Box>
    );
  }

  if (!isCollectionObject && collectionLength === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          К сожалению,{collectionTitle} не найдены!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Перейдите к этапу создания.
        </Typography>
      </Paper>
    );
  }

  return <>{children}</>;
};
