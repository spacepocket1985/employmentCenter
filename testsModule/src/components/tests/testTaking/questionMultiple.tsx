// Описание: Компонент вопроса с множественным выбором
// Использует Checkbox для выбора нескольких вариантов

import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import type { AnswerOptionType } from 'src/types/tests.types';

/**
 * Props для QuestionMultiple
 */
type QuestionMultipleProps = {
  /** ID вопроса */
  questionId: string;
  /** Текст вопроса */
  text: string;
  /** Варианты ответов */
  options: AnswerOptionType[];
  /** Выбранные ID вариантов */
  selectedIds: string[];
  /** Обработчик выбора */
  onSelect: (optionIds: string[]) => void;
};

/**
 * Компонент вопроса с множественным выбором
 */
export const QuestionMultiple: React.FC<QuestionMultipleProps> = ({
  text,
  options,
  selectedIds,
  onSelect,
}: QuestionMultipleProps): React.ReactElement => {
  const handleChange = (optionId: string): void => {
    const newSelectedIds: string[] = selectedIds.includes(optionId)
      ? selectedIds.filter((id: string): boolean => id !== optionId)
      : [...selectedIds, optionId];
    
    onSelect(newSelectedIds);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        {text}
      </Typography>
      
      <FormGroup>
        {options.map((option: AnswerOptionType) => {
          const isChecked: boolean = selectedIds.includes(option.id);
          
          return (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(): void => handleChange(option.id)}
                />
              }
              label={option.text}
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: isChecked ? '#103896' : 'divider',
                backgroundColor: isChecked ? 'rgba(16, 56, 150, 0.06)' : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(16, 56, 150, 0.04)',
                },
                '& .MuiFormControlLabel-label': {
                  width: '100%',
                },
              }}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
};