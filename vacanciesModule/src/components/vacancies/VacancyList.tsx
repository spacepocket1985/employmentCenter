import React, { useState } from 'react';
import { Box, Card, Pagination } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { Vacancy } from './Vacancy';
import { ModuleHeader } from '../moduleElements/ModuleHeader';
import { VacancyType } from '../../types/types';
import { DepartmentHrInfo } from '../departmentHR/DepartmentHR';

export const VacancyList: React.FC<{ vacancies: VacancyType[] }> = ({
  vacancies,
}) => {
  // Константа для количества вакансий на странице
  const VACANCIES_PER_PAGE = 6;

  // Состояние для текущей страницы
  const [currentPage, setCurrentPage] = useState(1);

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(vacancies.length / VACANCIES_PER_PAGE);

  // Вычисляем индексы для текущей страницы
  const startIndex = (currentPage - 1) * VACANCIES_PER_PAGE;
  const endIndex = startIndex + VACANCIES_PER_PAGE;

  // Получаем вакансии для текущей страницы
  const currentVacancies = vacancies.slice(startIndex, endIndex);

  // Обработчик изменения страницы
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <ModuleHeader title="Вакансии станции">
        <WorkIcon sx={{ mr: 1, color: 'white' }} />
      </ModuleHeader>

      <Box sx={{ width: '100%', maxWidth: 800, mb: 2 }}>
        {currentVacancies.map((vacancy, index) => (
          <React.Fragment key={vacancy._id}>
            <Card
              variant="outlined"
              sx={{
                mb: 1.2,
                borderRadius: 2,
                // чередование фона для визуального разделения
                bgcolor:
                  index % 2 === 0 ? 'background.default' : 'action.hover',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-1px)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              <Vacancy vacancy={vacancy} index={index} />
            </Card>
          </React.Fragment>
        ))}
      </Box>
      <DepartmentHrInfo />
      {/* Компонент пагинации */}
      {vacancies.length > VACANCIES_PER_PAGE && (
        <Pagination
          variant="outlined"
          shape="rounded"
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          size="small"
          sx={{
            mt: 2,
            mb: 3,
            '& .MuiPaginationItem-root': {
              fontSize: '1rem',
            },
          }}
        />
      )}
    </Box>
  );
};
