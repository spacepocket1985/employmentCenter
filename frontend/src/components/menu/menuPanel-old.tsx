import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  LinearProgress,
  Chip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { MenuStatus } from 'src/types/menu.types';
import { clearMenu, getMenuStatus, uploadMenu } from '@api/menuApi';
import { validateCSVFile } from '@utils/csvParser';


const MenuPanel: React.FC = () => {
  const [status, setStatus] = useState<MenuStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
  } | null>(null);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const loadStatus = async () => {
    setIsLoading(true);
    
    try {
      const response = await getMenuStatus();
      
      if (response.success && response.data) {
        setStatus(response.data);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadProgress(0);
    setValidationResult(null);
    setErrorMessage('');

    setIsLoading(true);
    const result = await validateCSVFile(file);
    setValidationResult(result);
    setIsLoading(false);

    if (!result.isValid) {
      setErrorMessage('Файл содержит ошибки');
      setValidationDialogOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !validationResult?.isValid) {
      setErrorMessage('Сначала выберите валидный CSV файл');
      return;
    }

    setIsLoading(true);
    setUploadProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadMenu(selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setSuccessMessage(response.message || 'Меню успешно загружено');
        setSelectedFile(null);
        setValidationResult(null);
        loadStatus();
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleClearMenu = async () => {
    setIsLoading(true);
    
    try {
      const response = await clearMenu();
      
      if (response.success) {
        setSuccessMessage(response.message || 'Меню успешно очищено');
        setStatus(null);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
      setClearDialogOpen(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Управление меню
      </Typography>

      {/* Статус меню */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Текущее состояние
        </Typography>
        
        {isLoading && !status ? (
          <LinearProgress />
        ) : status ? (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip 
                icon={<CheckCircleIcon />} 
                label={`Дней: ${status.daysCount}`} 
                color="primary" 
                size="small"
              />
              <Chip 
                icon={<CheckCircleIcon />} 
                label={`Блюд: ${status.dishesCount}`} 
                color="secondary" 
                size="small"
              />
            </Box>
            
            {status.dates.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Даты в меню:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  {status.dates.map((date) => (
                    <Chip key={date} label={date} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Alert severity="info">
            Меню не загружено
          </Alert>
        )}
      </Paper>

      {/* Загрузка меню */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Загрузка нового меню
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          Загрузите CSV файл, сохранённый из Excel
        </Alert>

        <Box sx={{ mb: 2 }}>
          <input
            accept=".csv"
            style={{ display: 'none' }}
            id="csv-file-upload"
            type="file"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
          <label htmlFor="csv-file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              disabled={isLoading}
              sx={{ mr: 1 }}
            >
              Выбрать файл
            </Button>
          </label>

          {selectedFile && (
            <Chip
              label={selectedFile.name}
              onDelete={() => {
                setSelectedFile(null);
                setValidationResult(null);
              }}
              color={validationResult?.isValid ? "success" : "error"}
              size="small"
            />
          )}
        </Box>

        {uploadProgress > 0 && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || !validationResult?.isValid || isLoading}
            startIcon={<UploadIcon />}
          >
            Загрузить
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => setClearDialogOpen(true)}
            disabled={!status || isLoading}
            startIcon={<DeleteIcon />}
          >
            Очистить
          </Button>
        </Box>

        {validationResult && !validationResult.isValid && (
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => setValidationDialogOpen(true)}
            startIcon={<ErrorIcon />}
            sx={{ mt: 1 }}
          >
            Ошибки ({validationResult.errors.length})
          </Button>
        )}
      </Paper>

      {/* Диалог ошибок валидации */}
      <Dialog
        open={validationDialogOpen}
        onClose={() => setValidationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Ошибки валидации
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Файл содержит ошибки
          </Alert>
          
          <List dense>
            {validationResult?.errors.map((error, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText primary={error} />
                </ListItem>
                {index < validationResult.errors.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationDialogOpen(false)}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения очистки */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
      >
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
          <Button onClick={() => setClearDialogOpen(false)}>
            Отмена
          </Button>
          <Button 
            onClick={handleClearMenu} 
            color="error" 
            variant="contained"
            disabled={isLoading}
          >
            Очистить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuPanel;