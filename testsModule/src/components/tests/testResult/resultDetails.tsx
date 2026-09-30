// Описание: Компонент для отображения деталей по шкалам
// Показывает баллы по каждой шкале в виде прогресс-баров
// Если переданы интерпретации, показывает их для каждой шкалы

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Stack,
  Chip,
} from '@mui/material';
import { translateScale } from '@utils/scaleTranslations';
import { ResultRecommendations } from './resultRecommendations';
import type { ScaleScoreType, ScaleInterpretationType } from 'src/types/tests.types';

/**
 * Props для ResultDetails
 */
type ResultDetailsProps = {
  /** Массив результатов по шкалам */
  scaleScores: ScaleScoreType[];
  /** Массив интерпретаций по шкалам (опционально) */
  scaleInterpretations?: ScaleInterpretationType[];
};

/**
 * Определение цвета для уровня интерпретации
 */
const getLevelColor = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('низк') || lowerTitle.includes('норм')) {
    return '#2e7d32'; // зелёный
  }
  if (lowerTitle.includes('умерен')) {
    return '#ed6c02'; // оранжевый
  }
  if (lowerTitle.includes('высок') || lowerTitle.includes('тяжёл')) {
    return '#d32f2f'; // красный
  }
  if (lowerTitle.includes('очень высок')) {
    return '#b71c1c'; // тёмно-красный
  }
  return '#103896'; // синий (по умолчанию)
};

/**
 * Определение цвета для прогресс-бара на основе процента
 */
const getProgressColor = (percentage: number): string => {
  if (percentage < 33) return '#2e7d32'; // зелёный
  if (percentage < 66) return '#ed6c02'; // оранжевый
  return '#d32f2f'; // красный
};

/**
 * Компонент для отображения деталей по шкалам
 */
export const ResultDetails: React.FC<ResultDetailsProps> = ({
  scaleScores,
  scaleInterpretations = [],
}: ResultDetailsProps): React.ReactElement | null => {
  // Если нет данных по шкалам, ничего не показываем
  if (!scaleScores || scaleScores.length === 0) {
    return null;
  }

  // Создаём карту интерпретаций для быстрого доступа
  const interpretationMap = new Map<string, ScaleInterpretationType>(
    scaleInterpretations.map((item) => [item.scaleId, item])
  );

  // Проверяем, есть ли интерпретации
  const hasInterpretations = scaleInterpretations.length > 0;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#103896' }}>
        {hasInterpretations ? 'Результаты по шкалам с интерпретацией' : 'Результаты по шкалам'}
      </Typography>

      <Stack spacing={3}>
        {scaleScores.map((scale: ScaleScoreType) => {
          const color = getProgressColor(scale.percentage);
          const translatedName = translateScale(scale.scaleId);
          const interpretation = interpretationMap.get(scale.scaleId);
          
          // Цвет для интерпретации (если есть)
          const levelColor = interpretation 
            ? getLevelColor(interpretation.interpretation.title) 
            : color;

          return (
            <Box key={scale.scaleId}>
              {/* Заголовок: название шкалы + баллы + чип интерпретации */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.5,
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  {translatedName}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    {scale.score} / {scale.maxScore} ({Math.round(scale.percentage)}%)
                  </Typography>
                  
                  {/* Чип с интерпретацией (если есть) */}
                  {hasInterpretations && interpretation && (
                    <Chip
                      label={interpretation.interpretation.title}
                      size="small"
                      sx={{
                        backgroundColor: levelColor,
                        color: 'white',
                        fontWeight: 500,
                        height: 24,
                        '& .MuiChip-label': {
                          fontSize: '0.75rem',
                          px: 1.5,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Прогресс-бар */}
              <LinearProgress
                variant="determinate"
                value={Math.min(scale.percentage, 100)}
                sx={{
                  height: hasInterpretations ? 10 : 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(16, 56, 150, 0.12)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: hasInterpretations ? levelColor : color,
                    borderRadius: 4,
                  },
                }}
              />

              {/* Описание интерпретации (если есть) — УВЕЛИЧЕННЫЙ ШРИФТ */}
              {hasInterpretations && interpretation && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {interpretation.interpretation.description}
                  </Typography>
                  
                  {/* Рекомендации для шкалы */}
                  {interpretation.interpretation.recommendations && 
                   interpretation.interpretation.recommendations.length > 0 && (
                    <ResultRecommendations
                      recommendations={interpretation.interpretation.recommendations}
                      title="Рекомендации"
                    />
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};