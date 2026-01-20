import React, { useState, useRef } from 'react';
import {
  TextField,
  Chip,
  Box,
  ClickAwayListener,
  Paper,
  ListItem,
  IconButton,
} from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface ResponsibleSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

const ResponsibleSelect: React.FC<ResponsibleSelectProps> = ({
  value,
  onChange,
  label = 'Ответственные',
  disabled = false,
  error,
  helperText,
}) => {
  const { responsiblePersons } = useAppSelector((state) => state.data);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const handleAddResponsible = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveResponsible = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleSelectFromList = (person: string) => {
    if (!value.includes(person)) {
      onChange([...value, person]);
    }
    setIsOpen(false);
    setInputValue('');
  };

  const handleTextFieldKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAddResponsible();
    }
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  // Фильтруем варианты, исключая уже выбранных
  const filteredOptions = responsiblePersons.filter(
    (person) => !value.includes(person)
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        {/* Отображение выбранных ответственных */}
        {value.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mb: 1,
              p: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor: 'background.paper',
            }}
          >
            {value.map((person, index) => (
              <Chip
                key={index}
                label={person}
                onDelete={() => handleRemoveResponsible(index)}
                deleteIcon={<DeleteIcon fontSize="small" />}
                size="small"
                sx={{
                  maxWidth: '100%',
                  '& .MuiChip-label': {
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Поле для ввода нового ответственного */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            ref={textFieldRef}
            label={label}
            placeholder="Введите ФИО ответственного"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleTextFieldKeyDown}
            error={error}
            helperText={helperText}
            disabled={disabled}
            size="small"
            sx={{
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
              },
            }}
          />
          <IconButton
            onClick={handleAddResponsible}
            color="primary"
            disabled={!inputValue.trim() || disabled}
            sx={{ mt: 1 }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Выпадающий список с вариантами */}
        {isOpen && !disabled && filteredOptions.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              maxHeight: 200,
              overflow: 'auto',
              mt: 0.5,
              boxShadow: 3,
            }}
          >
            {filteredOptions.map((person, index) => (
              <ListItem
                key={index}
                onClick={() => handleSelectFromList(person)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  py: 1,
                  px: 2,
                  fontSize: '0.875rem',
                }}
              >
                {person}
              </ListItem>
            ))}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default ResponsibleSelect;
