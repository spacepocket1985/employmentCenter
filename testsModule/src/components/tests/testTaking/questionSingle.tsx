// Описание: Компонент вопроса с одиночным выбором

import React from 'react';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
} from '@mui/material';
import type { AnswerOptionType } from 'src/types/tests.types';

type QuestionSingleProps = {
  questionId: string;
  text: string;
  options: AnswerOptionType[];
  selectedId: string | null;
  onSelect: (optionId: string) => void;
};

export const QuestionSingle: React.FC<QuestionSingleProps> = ({
  questionId,
  text,
  options,
  selectedId,
  onSelect,
}: QuestionSingleProps): React.ReactElement => {
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onSelect(event.target.value);
  };

  return (
    <Box>
      {/* Убедитесь, что текст отображается */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight:600, color:'#103896' }}>
        {text || 'Текст вопроса отсутствует'}  {/* ← Временная проверка */}
      </Typography>
      
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          name={questionId}
          value={selectedId || ''}
          onChange={handleChange}
        >
          {options.map((option: AnswerOptionType) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.text}
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: selectedId === option.id ? '#103896' : 'divider',
                backgroundColor: selectedId === option.id ? 'rgba(16, 56, 150, 0.06)' : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(16, 56, 150, 0.04)',
                },
                '& .MuiFormControlLabel-label': {
                  width: '100%',
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};