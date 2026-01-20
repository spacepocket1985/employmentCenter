import React from 'react';
import { Box, Button, CircularProgress, Tooltip, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

interface PlanActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
  hasValidationErrors?: boolean;
  hasEmptyDays?: boolean;
  mode?: 'create' | 'edit';
  submitLabel?: string;
  cancelLabel?: string;
}

const PlanActions: React.FC<PlanActionsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting,
  isDisabled,
  hasValidationErrors = false,
  hasEmptyDays = false,
  mode = 'create',
  submitLabel,
  cancelLabel,
}) => {
  const getErrorMessage = () => {
    if (hasValidationErrors) {
      return "Есть ошибки заполнения. Исправьте их перед сохранением.";
    }
    if (hasEmptyDays) {
      return "Есть дни без мероприятий. Добавьте мероприятия во все дни.";
    }
    return "";
  };

  const getButtonText = () => {
    if (hasValidationErrors) {
      return 'Есть ошибки';
    }
    if (hasEmptyDays) {
      return 'Дни без мероприятий';
    }
    
    // Если передана кастомная надпись - используем её
    if (submitLabel) {
      return isSubmitting ? `${submitLabel}...` : submitLabel;
    }
    
    // Иначе используем стандартные надписи в зависимости от режима
    if (isSubmitting) {
      return mode === 'create' ? 'Создание...' : 'Сохранение...';
    }
    return mode === 'create' ? 'Создать план' : 'Сохранить изменения';
  };

  const getButtonColor = () => {
    if (hasValidationErrors) return "error";
    if (hasEmptyDays) return "warning";
    return "primary";
  };

  const getStartIcon = () => {
    if (hasValidationErrors) return <ErrorIcon />;
    if (hasEmptyDays) return <WarningIcon />;
    if (isSubmitting) return <CircularProgress size={20} />;
    return null;
  };

  const getTooltipTitle = () => {
    if (hasValidationErrors) return "Исправьте ошибки перед сохранением";
    if (hasEmptyDays) return "Добавьте мероприятия во все дни";
    if (mode === 'edit') return "Сохранить внесенные изменения";
    return "Создать новый план мероприятий";
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mt: 3, 
      p: 2, 
      bgcolor: 'grey.50', 
      borderRadius: 1 
    }}>
      <Box>
        {(hasValidationErrors || hasEmptyDays) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasValidationErrors ? <ErrorIcon color="error" fontSize="small" /> : <WarningIcon color="warning" fontSize="small" />}
            <Typography variant="body2" color={hasValidationErrors ? "error" : "warning.main"}>
              {getErrorMessage()}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={onCancel}
        >
          {cancelLabel || (mode === 'create' ? 'Отменить' : 'Отменить редактирование')}
        </Button>

        <Tooltip 
          title={getTooltipTitle()}
          placement="top"
        >
          <span>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={isSubmitting || isDisabled || hasValidationErrors || hasEmptyDays}
              startIcon={getStartIcon()}
              color={getButtonColor()}
            >
              {getButtonText()}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default PlanActions;