import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
} from '@mui/material';
import { MenuStatus } from 'src/types/menu.types';

interface ClearMenuDialogProps {
  open: boolean;
  status: MenuStatus | null | undefined;
  isClearing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearMenuDialog: React.FC<ClearMenuDialogProps> = ({
  open,
  status,
  isClearing,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Подтверждение</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Очистить меню?
        </Alert>
        {status && (
          <Typography variant="body2" color="text.secondary">
            Дней: {status.daysCount}, блюд: {status.dishesCount}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isClearing}>
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isClearing}
        >
          {isClearing ? 'Очистка...' : 'Очистить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClearMenuDialog;
