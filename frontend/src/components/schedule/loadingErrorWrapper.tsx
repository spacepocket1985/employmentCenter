import React from 'react';
import { Box, CircularProgress, Alert, AlertTitle, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface LoadingErrorWrapperProps {
  isLoading: boolean;
  error?: unknown;
  children: React.ReactNode;
  onRetry?: () => void;
}

const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  isLoading,
  error,
  children,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
    
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry} startIcon={<RefreshIcon />}>
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

  return <>{children}</>;
};

export default LoadingErrorWrapper;