import { useState, ReactNode } from 'react';
import {
  TableCell,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@utils/errorUtils';

// Пропсы компонента
export type UIITableItemsActionsProps = {
  // Основные пропсы
  itemId: string;
  itemTitle: string;
  
  // Функции
  onDelete: (id: string) => Promise<void>;
  onRefetch: () => void;
  
  // Опциональные пропсы
  viewOption?: boolean;
  editPath?: string;
  onView?: (id: string) => void;
  onExport?: (id: string) => void;
  customViewComponent?: ReactNode;
  
  // Дополнительные опции
  disableEdit?: boolean;
  disableDelete?: boolean;
  additionalActions?: ReactNode;
  
  // Текст для диалогов
  deleteConfirmText?: string;
  viewDialogTitle?: string;
};

export const UIITableItemsActions: React.FC<UIITableItemsActionsProps> = ({
  itemId,
  itemTitle,
  viewOption = false,
  editPath = '',
  onDelete,
  onRefetch,
  onView,
  onExport,
  customViewComponent,
  disableEdit = false,
  disableDelete = false,
  additionalActions,
  deleteConfirmText = `Вы уверены, что хотите удалить "${itemTitle}"? Это действие нельзя отменить.`,
  viewDialogTitle = `Просмотреть ${itemTitle}`,
}) => {
  const navigate = useNavigate();

  const [viewItemId, setViewItemId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleViewItem = (id: string) => {
    if (onView) {
      onView(id);
    } else {
      setViewItemId(id);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteConfirmId) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
      onRefetch();
    } catch (err: unknown) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditItem = () => {
    if (editPath) {
      navigate(editPath);
    }
  };

  const handleExportItem = (id: string) => {
    if (onExport) {
      onExport(id);
    } else {
      console.log('Export item:', id);
    }
  };

  const hasViewDialog = !onView && viewOption && customViewComponent;

  return (
    <>
      <TableCell align="center">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {viewOption && (
            <Tooltip title="Просмотреть">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleViewItem(itemId)}
                disabled={!itemId}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {!disableEdit && (
            <Tooltip title="Редактировать">
              <IconButton
                size="small"
                color="info"
                onClick={handleEditItem}
                disabled={!editPath}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {onExport && (
            <Tooltip title="Экспортировать">
              <IconButton
                size="small"
                color="success"
                onClick={() => handleExportItem(itemId)}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {!disableDelete && (
            <Tooltip title="Удалить">
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteConfirmId(itemId)}
                disabled={!itemId}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {additionalActions}
        </Box>
      </TableCell>
      
      {/* Диалог просмотра (только если используется внутренний state) */}
      {hasViewDialog && (
        <Dialog
          open={!!viewItemId}
          onClose={() => setViewItemId(null)}
          maxWidth="lg"
          fullWidth
          scroll="paper"
        >
          <DialogTitle sx={{ pb: 1 }}>{viewDialogTitle}</DialogTitle>
          <DialogContent dividers>
            {viewItemId && customViewComponent}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewItemId(null)} color="primary">
              Закрыть
            </Button>
            {onExport && (
              <Button
                onClick={() => {
                  if (viewItemId) handleExportItem(viewItemId);
                }}
                variant="contained"
                startIcon={<DownloadIcon />}
              >
                Экспортировать
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={!!deleteConfirmId}
        onClose={() => !isDeleting && setDeleteConfirmId(null)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteConfirmText}
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmId(null)}
            disabled={isDeleting}
          >
            Отмена
          </Button>
          <Button
            onClick={handleDeleteItem}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Тип для мутации удаления RTK Query
export type DeleteMutationType = (arg: string) => {
  unwrap: () => Promise<unknown>;
  abort: () => void;
  reset: () => void;
};

// Вспомогательная функция для создания обработчиков удаления из мутаций RTK Query
export const createDeleteHandler = (
  mutation: DeleteMutationType
): ((id: string) => Promise<void>) => {
  return async (id: string): Promise<void> => {
    await mutation(id).unwrap();
  };
};