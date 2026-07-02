import React, { useRef } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';


interface LoadingErrorWrapperProps {
  /** Флаг загрузки */
  isLoading: boolean;
  /** Ошибка (если есть) */
  error?: unknown;
  /** Дочерние компоненты для отображения */
  children: React.ReactNode;
  /** Функция повтора запроса */
  onRetry?: () => void;
  /** Флаг, является ли данные коллекцией объектов */
  isCollectionObject?: boolean;
  /** Длина коллекции (для проверки пустоты) */
  collectionLength?: number;
  /** Заголовок коллекции для сообщения о пустоте */
  collectionTitle?: string;
  /** Показывать кнопку печати */
  showPrintButton?: boolean;
  /** Название документа для печати */
  printDocumentTitle?: string;
  /** Дополнительные стили для печати */
  printStyles?: string;
}

/**
 * Компонент-обертка для отображения состояний загрузки, ошибок и пустых данных
 * Также добавляет кнопку печати для распечатки содержимого
 */
export const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  isLoading,
  error,
  children,
  onRetry,
  isCollectionObject = false,
  collectionLength,
  collectionTitle = ' ничего',
  showPrintButton = true,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);


  // Если идет загрузка - показываем спиннер
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Если есть ошибка - показываем алерт
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

  // Проверка на пустую коллекцию
  const isEmptyCollection =
    !isCollectionObject &&
    collectionLength !== undefined &&
    collectionLength === 0;

  // Если коллекция пуста - показываем сообщение
  if (isEmptyCollection) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          К сожалению,{collectionTitle} не найдены!
        </Typography>
      </Paper>
    );
  }

  // Основной рендер с контентом и опциональной кнопкой печати
  return (
    <Box sx={{ width: '100%' }}>
      {/* Шапка с кнопкой печати */}
      {showPrintButton && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{
            mb: 2,
            position: 'sticky',
            top: 0,
            zIndex: 100,
            bgcolor: 'background.paper',
            p: 1,
          }}
        >

        </Stack>
      )}

      {/* Контент для печати */}
      <div ref={contentRef}>{children}</div>
    </Box>
  );
};
