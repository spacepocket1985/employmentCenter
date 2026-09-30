// Описание: Компонент для отображения интерпретаций по шкалам
// Используется для тестов, где каждая шкала имеет свою интерпретацию
// (например, DASS-21: депрессия, тревога, стресс)

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { translateScale } from '@utils/scaleTranslations';
import type { ScaleInterpretationType } from 'src/types/tests.types';

/**
 * Props для ScaleInterpretations
 */
type ScaleInterpretationsProps = {
  /** Массив интерпретаций по шкалам */
  scaleInterpretations: ScaleInterpretationType[];
  /** Массив баллов по шкалам (для отображения прогресса) */
  scaleScores?: {
    scaleId: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  /** Заголовок блока */
  title?: string;
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
 * Определение иконки для уровня интерпретации
 */
const getLevelIcon = (title: string): React.ReactElement => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('низк') || lowerTitle.includes('норм')) {
    return <CheckCircleIcon sx={{ color: '#2e7d32' }} />;
  }
  if (lowerTitle.includes('умерен')) {
    return <WarningIcon sx={{ color: '#ed6c02' }} />;
  }
  if (lowerTitle.includes('высок') || lowerTitle.includes('тяжёл')) {
    return <ErrorIcon sx={{ color: '#d32f2f' }} />;
  }
  if (lowerTitle.includes('очень высок')) {
    return <ErrorIcon sx={{ color: '#b71c1c' }} />;
  }
  return <CheckCircleIcon sx={{ color: '#103896' }} />;
};

/**
 * Компонент для отображения интерпретаций по шкалам
 */
export const ScaleInterpretations: React.FC<ScaleInterpretationsProps> = ({
  scaleInterpretations,
  scaleScores,
  title = 'Результаты по шкалам',
}: ScaleInterpretationsProps): React.ReactElement | null => {
  const [expanded, setExpanded] = useState<string | false>(false);

  // Если нет данных, ничего не показываем
  if (!scaleInterpretations || scaleInterpretations.length === 0) {
    return null;
  }

  const handleChange = (scaleId: string) => (_event: React.SyntheticEvent, isExpanded: boolean): void => {
    setExpanded(isExpanded ? scaleId : false);
  };

  // Находим баллы для шкалы
  const getScaleScore = (scaleId: string): { score: number; maxScore: number; percentage: number } | undefined => {
    return scaleScores?.find((s) => s.scaleId === scaleId);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#103896' }}>
        {title}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {scaleInterpretations.map((item: ScaleInterpretationType) => {
          const { scaleId, interpretation } = item;
          const translatedName = translateScale(scaleId);
          const scaleScore = getScaleScore(scaleId);
          const levelColor = getLevelColor(interpretation.title);
          const levelIcon = getLevelIcon(interpretation.title);
          const isExpanded = expanded === scaleId;

          return (
            <Accordion
              key={scaleId}
              expanded={isExpanded}
              onChange={handleChange(scaleId)}
              sx={{
                border: `1px solid ${levelColor}`,
                borderRadius: 1,
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: 0,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: `${levelColor}10`,
                  borderRadius: 1,
                  '&.Mui-expanded': {
                    borderRadius: '4px 4px 0 0',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  {levelIcon}
                  <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 500 }}>
                    {translatedName}
                  </Typography>
                  <Chip
                    label={interpretation.title}
                    size="small"
                    sx={{
                      backgroundColor: levelColor,
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                  {scaleScore && (
                    <Chip
                      label={`${scaleScore.score} / ${scaleScore.maxScore}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 2 }}>
                {/* Прогресс-бар */}
                {scaleScore && (
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(scaleScore.percentage)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(scaleScore.percentage, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(16, 56, 150, 0.12)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: levelColor,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Описание интерпретации */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {interpretation.description}
                </Typography>

                {/* Рекомендации */}
                {interpretation.recommendations && interpretation.recommendations.length > 0 && (
                  <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Рекомендации:
                    </Typography>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                      {interpretation.recommendations.map((rec: string, index: number) => (
                        <li key={index}>
                          <Typography variant="caption" color="text.secondary">
                            {rec}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Paper>
  );
};