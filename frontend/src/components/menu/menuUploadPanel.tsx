import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { UITitle } from '@components/ui';

interface MenuUploadPanelProps {
  selectedFile: File | null;
  validationResult: { isValid: boolean; errors: string[] } | null;
  uploadProgress: number;
  isLoading: boolean;
  hasMenuData: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onClear: () => void;
  onValidationErrorsClick: () => void;
}

const MenuUploadPanel: React.FC<MenuUploadPanelProps> = ({
  selectedFile,
  validationResult,
  uploadProgress,
  isLoading,
  hasMenuData,
  onFileSelect,
  onUpload,
  onClear,
  onValidationErrorsClick,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <UITitle variant="body1"> Загрузка нового меню</UITitle>

      <Alert severity="info" sx={{ mb: 2 }}>
        Загрузите CSV файл, сохранённый из Excel
      </Alert>

      <Box sx={{ mb: 2 }}>
        <input
          accept=".csv"
          style={{ display: 'none' }}
          id="csv-file-upload"
          type="file"
          onChange={onFileSelect}
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
              // Удаление файла обрабатывается в родителе
              // Это нужно будет передать через пропсы
            }}
            color={validationResult?.isValid ? 'success' : 'error'}
            size="small"
          />
        )}
      </Box>

      {uploadProgress > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" display="block" gutterBottom>
            Загрузка: {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          onClick={onUpload}
          disabled={!selectedFile || !validationResult?.isValid || isLoading}
          startIcon={<UploadIcon />}
        >
          {isLoading ? 'Загрузка...' : 'Загрузить'}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={onClear}
          disabled={!hasMenuData || isLoading}
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
          onClick={onValidationErrorsClick}
          startIcon={<ErrorIcon />}
          sx={{ mt: 1 }}
        >
          Ошибки ({validationResult.errors.length})
        </Button>
      )}
    </Paper>
  );
};

export default MenuUploadPanel;
