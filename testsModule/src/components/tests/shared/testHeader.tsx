// Описание: Компонент заголовка теста
// Показывает название иконку и метаданные

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Poll as PollIcon } from '@mui/icons-material';

/**
 * Props для TestHeader
 */
type TestHeaderProps = {
  /** Название теста */
  title: string;
  /** Категория теста */
  category: string | string[];
  /** Иконка (опционально) */
  icon?: React.ReactNode;
};

/**
 * Компонент заголовка теста
 */
export const TestHeader: React.FC<TestHeaderProps> = ({
  title,
  icon,
}: TestHeaderProps): React.ReactElement => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: '#103896',
          color: 'white',
          flexShrink: 0,
        }}
      >
        {icon || <PollIcon />}
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 600, flex: 1 }}>
        {title}
      </Typography>
    </Box>
  );
};
