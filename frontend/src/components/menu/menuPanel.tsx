import React from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useMenuPanel } from '@hooks/useMenuPanel';
import ClearMenuDialog from './clearMenuDialog';

import MenuUploadPanel from './menuUploadPanel';
import ValidationErrorsDialog from './validationErrorsDialog';
import MenuStatusPanel from './MenuStatusPanel';

export const MenuPanel: React.FC = () => {
  const {
    // Состояния
    selectedFile,
    validationResult,
    uploadProgress,
    successMessage,
    errorMessage,
    validationDialogOpen,
    clearDialogOpen,

    // RTK Query данные
    status,
    isStatusLoading,
    isUploading,
    isClearing,

    // Обработчики
    handleFileSelect,
    handleUpload,
    handleClearMenu,
    openValidationDialog,
    closeValidationDialog,
    openClearDialog,
    closeClearDialog,
    clearMessages,
  } = useMenuPanel();

  const isLoading = isStatusLoading || isUploading || isClearing;
  const hasMenuData = !!status;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Управление меню
      </Typography>

      {/* Статус меню */}
      <MenuStatusPanel status={status} isLoading={isStatusLoading} />

      {/* Загрузка меню */}
      <MenuUploadPanel
        selectedFile={selectedFile}
        validationResult={validationResult}
        uploadProgress={uploadProgress}
        isLoading={isLoading}
        hasMenuData={hasMenuData}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
        onClear={openClearDialog}
        onValidationErrorsClick={openValidationDialog}
      />

      {/* Диалог ошибок валидации */}
      <ValidationErrorsDialog
        open={validationDialogOpen}
        errors={validationResult?.errors || []}
        onClose={closeValidationDialog}
      />

      {/* Диалог подтверждения очистки */}
      <ClearMenuDialog
        open={clearDialogOpen}
        status={status}
        isClearing={isClearing}
        onClose={closeClearDialog}
        onConfirm={handleClearMenu}
      />

      {/* Уведомления */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={clearMessages}
      >
        <Alert onClose={clearMessages} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={clearMessages}
      >
        <Alert onClose={clearMessages} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
