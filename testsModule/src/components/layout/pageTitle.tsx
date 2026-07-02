// Описание: Компонент заголовка страницы
// Используется для отображения названия страницы с градиентным фоном

import React from 'react';
import { Paper, Typography } from '@mui/material';


type PageTitleProps = {
  title: string;
  subtitle?: string;
};

/**
 * Компонент заголовка страницы
 * @param title - Заголовок страницы
 * @param subtitle - Дополнительный текст (опционально)
 */
export const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  subtitle 
}: PageTitleProps): React.ReactElement => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        mb: 3,
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          py: 3,
          px: 2,
          background: 'linear-gradient(135deg, #103896, #1a4ec2)',
          color: 'white',
          fontWeight: 500,
          letterSpacing: '0.5px',
        }}
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="body2"
          align="center"
          sx={{
            py: 1.5,
            px: 2,
            bgcolor: 'rgba(16, 56, 150, 0.08)',
            color: 'text.secondary',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};