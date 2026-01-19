import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Alert,
  AlertTitle,
  Collapse,
  Button,
} from '@mui/material';
import {
  Error as ErrorIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { ValidationError, groupErrorsByDay, getErrorSummary } from '@utils/validationPlan';

interface ValidationErrorsProps {
  errors: ValidationError[];
  onClose?: () => void;
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors, onClose }) => {
  const [expanded, setExpanded] = React.useState(false);
  
  if (errors.length === 0) return null;

  const errorsByDay = groupErrorsByDay(errors);
  const errorSummary = getErrorSummary(errors);

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'time': return <TimeIcon fontSize="small" />;
      case 'description': return <DescriptionIcon fontSize="small" />;
      case 'responsiblePersons': return <PersonIcon fontSize="small" />;
      default: return <ErrorIcon fontSize="small" />;
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'time': return 'Время';
      case 'description': return 'Мероприятие';
      case 'responsiblePersons': return 'Ответственные';
      default: return field;
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        border: '2px solid', 
        borderColor: 'error.main',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Alert 
        severity="error" 
        sx={{ 
          borderRadius: 0,
          alignItems: 'center',
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setExpanded(!expanded)}
              sx={{ color: 'white' }}
            >
              {expanded ? 'Скрыть' : 'Подробнее'}
            </Button>
            {onClose && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={onClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )}
          </Box>
        }
      >
        <AlertTitle>
          Обнаружены ошибки заполнения
        </AlertTitle>
        {errorSummary}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Пожалуйста, исправьте отмеченные поля перед сохранением плана.
        </Typography>
      </Alert>

      <Collapse in={expanded}>
        <Box sx={{ maxHeight: 400, overflow: 'auto', p: 2, bgcolor: 'error.50' }}>
          <List dense>
            {Object.entries(errorsByDay).map(([dayNumber, dayErrors]) => (
              <React.Fragment key={dayNumber}>
                <ListItem sx={{ pl: 0, pt: 2, pb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="error">
                    День {dayNumber}:
                  </Typography>
                </ListItem>
                {dayErrors.map((error, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      pl: 4, 
                      py: 1,
                      borderLeft: '3px solid',
                      borderColor: 'error.main',
                      mb: 0.5,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getFieldIcon(error.field)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{getFieldLabel(error.field)}:</strong> {error.message}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Мероприятие #{error.eventIndex}, {error.dayOfWeek}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ValidationErrors;