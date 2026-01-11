import { useState, useEffect, useCallback } from 'react';
import { validateCSVFile } from '@utils/csvParser';
import { MenuStatus } from 'src/types/menu.types';
import { useGetMenuStatusQuery, useUploadMenuMutation, useClearMenuMutation } from '@store/slices';


interface UseMenuPanelReturn {
  // Состояния
  selectedFile: File | null;
  validationResult: { isValid: boolean; errors: string[] } | null;
  uploadProgress: number;
  successMessage: string;
  errorMessage: string;
  validationDialogOpen: boolean;
  clearDialogOpen: boolean;

  // RTK Query данные
  status: MenuStatus | null | undefined;
  isStatusLoading: boolean;
  isUploading: boolean;
  isClearing: boolean;

  // Обработчики
  handleFileSelect: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleUpload: () => Promise<void>;
  handleClearMenu: () => Promise<void>;
  openValidationDialog: () => void;
  closeValidationDialog: () => void;
  openClearDialog: () => void;
  closeClearDialog: () => void;
  clearSelectedFile: () => void;
  clearMessages: () => void;
  refetchStatus: () => void;
}

export const useMenuPanel = (): UseMenuPanelReturn => {
  // RTK Query
  const {
    data: statusResponse,
    isLoading: isStatusLoading,
    error: statusError,
    refetch: refetchStatus,
  } = useGetMenuStatusQuery();

  const [
    uploadMenu,
    { isLoading: isUploading, error: uploadError, reset: resetUpload },
  ] = useUploadMenuMutation();
  const [
    clearMenu,
    { isLoading: isClearing, error: clearError, reset: resetClear },
  ] = useClearMenuMutation();

  // Состояния
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Обработка ошибок
  useEffect(() => {
    if (statusError) {
      setErrorMessage('Ошибка при загрузке статуса меню');
    }
  }, [statusError]);

  useEffect(() => {
    if (uploadError) {
      setErrorMessage('Ошибка при загрузке файла');
      resetUpload();
    }
  }, [uploadError, resetUpload]);

  useEffect(() => {
    if (clearError) {
      setErrorMessage('Ошибка при очистке меню');
      resetClear();
    }
  }, [clearError, resetClear]);

  // Обработчики
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setSelectedFile(file);
      setUploadProgress(0);
      setValidationResult(null);
      setErrorMessage('');

      const result = await validateCSVFile(file);
      setValidationResult(result);

      if (!result.isValid) {
        setErrorMessage('Файл содержит ошибки');
        setValidationDialogOpen(true);
      }
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !validationResult?.isValid) {
      setErrorMessage('Сначала выберите валидный CSV файл');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', selectedFile);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await uploadMenu(formData).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setSuccessMessage(response.message || 'Меню успешно загружено');
        setSelectedFile(null);
        setValidationResult(null);
        refetchStatus();
      } else {
        setErrorMessage(response.message || 'Ошибка при загрузке');
      }
    } catch (error) {
      setErrorMessage('Ошибка при загрузке файла');
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [selectedFile, validationResult, uploadMenu, refetchStatus]);

  const handleClearMenu = useCallback(async () => {
    try {
      const response = await clearMenu().unwrap();

      if (response.success) {
        setSuccessMessage(response.message || 'Меню успешно очищено');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage('Ошибка при очистке меню');
    } finally {
      setClearDialogOpen(false);
    }
  }, [clearMenu]);

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setValidationResult(null);
  }, []);

  const clearMessages = useCallback(() => {
    setSuccessMessage('');
    setErrorMessage('');
  }, []);

  return {
    // Состояния
    selectedFile,
    validationResult,
    uploadProgress,
    successMessage,
    errorMessage,
    validationDialogOpen,
    clearDialogOpen,

    // RTK Query
    status: statusResponse?.data,
    isStatusLoading,
    isUploading,
    isClearing,

    // Обработчики
    handleFileSelect,
    handleUpload,
    handleClearMenu,
    openValidationDialog: () => setValidationDialogOpen(true),
    closeValidationDialog: () => setValidationDialogOpen(false),
    openClearDialog: () => setClearDialogOpen(true),
    closeClearDialog: () => setClearDialogOpen(false),
    clearSelectedFile,
    clearMessages,
    refetchStatus,
  };
};
