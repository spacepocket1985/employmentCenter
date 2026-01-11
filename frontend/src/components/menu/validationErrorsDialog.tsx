import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

interface ValidationErrorsDialogProps {
  open: boolean;
  errors: string[];
  onClose: () => void;
}

const ValidationErrorsDialog: React.FC<ValidationErrorsDialogProps> = ({
  open,
  errors,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ошибки валидации</DialogTitle>
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          Файл содержит ошибки
        </Alert>

        <List dense>
          {errors.map((error, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={error} />
              </ListItem>
              {index < errors.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationErrorsDialog;
