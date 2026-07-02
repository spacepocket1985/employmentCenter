// Описание: Компонент для кнопок действий с тестом
// Содержит кнопку "Пройти тест" и другие действия

import React from 'react';
import { Button, Box } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';

/**
 * Props для TestActions
 */
type TestActionsProps = {
  /** Обработчик нажатия на кнопку "Пройти тест" */
  onStart: () => void;
  /** Доступен ли тест для прохождения */
  isActive?: boolean;
  /** Дополнительные кнопки (опционально) */
  extraActions?: React.ReactNode;
};

/**
 * Компонент для кнопок действий с тестом
 */
export const TestActions: React.FC<TestActionsProps> = ({
  onStart,
  isActive = true,
  extraActions,
}: TestActionsProps): React.ReactElement => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={onStart}
        disabled={!isActive}
        startIcon={<PlayArrowIcon />}
        sx={{ 
          minWidth: 140,
          textTransform: 'none',
          fontWeight: 600,
        }}
      >
        Пройти тест
      </Button>
      
      {extraActions && (
        <Box sx={{ ml: 'auto' }}>
          {extraActions}
        </Box>
      )}
    </Box>
  );
};