import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, IconButton, Paper } from '@mui/material';
import { ControlPoint } from '@mui/icons-material';

import { UIFormInput } from '../ui/UIFormInput';
import validationSchemes from '../../utils/validationSchemes';

type FormAddVacancyType = {
  title: string;
  education: string;
  salary: number;
  wageRate: number;
};

export const FormAddVacancy = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormAddVacancyType>({
    resolver: yupResolver(validationSchemes),
    mode: 'onChange',
  });

  const addNewVacancyHandler: SubmitHandler<FormAddVacancyType> = ({
    title,
    salary,
    wageRate,
    education,
  }): void => {
    console.log(title, salary, wageRate, education);
    reset();
  };

  return (
    <Paper
      variant="outlined"
      square
      style={{ margin: 'auto', padding: '10px' }}
    >
      <form onSubmit={handleSubmit(addNewVacancyHandler)}>
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <UIFormInput
            type="text"
            name="title"
            about="Вакансия"
            register={register}
            error={errors.title?.message ? errors.title.message : null}
          />
          <UIFormInput
            type="text"
            name="education"
            about="Образование"
            register={register}
            error={errors.education?.message ? errors.education.message : null}
          />
          <UIFormInput
            type="text"
            name="salary"
            about="Зарплата"
            register={register}
            error={errors.salary?.message ? errors.salary.message : null}
          />
          <UIFormInput
            type="text"
            name="wageRate"
            about="Ставка"
            register={register}
            error={errors.wageRate?.message ? errors.wageRate.message : null}
          />
          <IconButton color={'primary'} type="submit" disabled={!isValid}>
            <ControlPoint />
          </IconButton>
        </Grid>
      </form>
    </Paper>
  );
};
