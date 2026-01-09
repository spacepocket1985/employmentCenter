import React from 'react';
import { Typography } from '@mui/material';
import { VacancyType } from '../../types/types';

type VacancyProps = {
  vacancy: VacancyType;
  index?: number;
};

export const Vacancy: React.FC<VacancyProps> = React.memo(({ vacancy }) => {
  const vacancyTitle = `${vacancy.title
    .charAt(0)
    .toUpperCase()}${vacancy.title.slice(1)}. `;
  return (
    <>
      <Typography
        sx={{
          padding: 1,
          fontSize: '0.8rem',
        }}
      >
        <span style={{ fontWeight: 'bold', color: '#103896' }}>
          {vacancyTitle}
        </span>
        {vacancy.education !== 'не имеет значения' && (
          <>
            <span>{' Образование: '}</span>
            <span>{vacancy.education}.</span>
          </>
        )}
        <span>{' Зарплата: '}</span>
        <span>{vacancy.salary}</span>
      </Typography>
    </>
  );
});
