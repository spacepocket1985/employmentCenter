// Описание: Компонент для отображения метаданных теста
// Показывает количество вопросов, время прохождения и другие параметры

import React from 'react';
import { Chip, Stack } from '@mui/material';
import {
  Poll as PollIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

/**
 * Props для TestMeta
 */
type TestMetaProps = {
  /** Количество вопросов */
  questionCount: number;
  /** Время прохождения в минутах (опционально) */
  estimatedTime?: number;
  /** Категория теста */
  category: string | string[];
  /** Активен ли тест */
  isActive?: boolean;
};

/**
 * Компонент для отображения метаданных теста
 */
export const TestMeta: React.FC<TestMetaProps> = ({
  questionCount,
  estimatedTime,
  category,
  isActive = true,
}: TestMetaProps): React.ReactElement => {
  // Форматируем категорию
  const categoryText: string = Array.isArray(category)
    ? category.join(', ')
    : category;

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
      <Chip
        icon={<CategoryIcon />}
        label={categoryText}
        size="small"
        color="primary"
        variant="outlined"
      />

      <Chip
        icon={<PollIcon />}
        label={`${questionCount} вопросов`}
        size="small"
        variant="outlined"
      />

      {estimatedTime && (
        <Chip
          icon={<TimeIcon />}
          label={`${estimatedTime} мин`}
          size="small"
          variant="outlined"
        />
      )}

      {isActive ? (
        <Chip
          icon={<CheckCircleIcon />}
          label="Доступен"
          size="small"
          color="success"
        />
      ) : (
        <Chip label="Недоступен" size="small" color="error" />
      )}
    </Stack>
  );
};
