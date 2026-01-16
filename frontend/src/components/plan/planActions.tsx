import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

interface PlanActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

const PlanActions: React.FC<PlanActionsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting,
  isDisabled,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
      <Button variant="outlined" color="error" onClick={onCancel}>
        Отменить
      </Button>

      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            Сохранение...
          </>
        ) : (
          'Сохранить план'
        )}
      </Button>
    </Box>
  );
};

export default PlanActions;
