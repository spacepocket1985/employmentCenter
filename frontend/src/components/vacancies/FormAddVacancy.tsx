import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Paper } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import {
  addNewVacancyToDB,
  getAllVacanciesFromDB,
  updateVacancyFromDB,
} from '../../store/slices/vacanciesSlice';
import { UIFormInput } from '../ui/UIFormInput';
import validationSchemes from '../../utils/validationSchemes';
import { VacancyType } from '../../types/types';
import { UIFormSelect } from '../ui/UIFormSelect';

type FormAddVacancyType = {
  title: string;
  education: string;
  salary: number;
  wageRate: number;
};

type FormAddVacancyPropsType = {
  isEditMode?: boolean;
  vacancy?: VacancyType;
};

export const FormAddVacancy = (props: FormAddVacancyPropsType): JSX.Element => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormAddVacancyType>({
    resolver: yupResolver(validationSchemes),
    mode: 'onChange',
  });

  const dispatch = useAppDispatch();

  const educationList = useAppSelector((state) => state.data.education);

  const addNewVacancyHandler: SubmitHandler<VacancyType> = async ({
    title,
    salary,
    wageRate,
    education,
    _id,
  }) => {
    const newVacancy: VacancyType = {
      title,
      salary,
      wageRate,
      education,
      _id,
    };
    console.log('isEditMode ==>', props.isEditMode);
    if (props.isEditMode)
      await dispatch(
        updateVacancyFromDB({
          title,
          salary,
          wageRate,
          education,
          _id: props.vacancy?._id,
        })
      );
    else await dispatch(addNewVacancyToDB(newVacancy));
    await dispatch(getAllVacanciesFromDB());
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
          spacing={2}
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
            defaultValue={props.vacancy?.title}
          />
          <UIFormInput
            type="text"
            name="salary"
            about="Зарплата"
            register={register}
            error={errors.salary?.message ? errors.salary.message : null}
            defaultValue={props.vacancy?.salary}
          />
          <UIFormInput
            type="text"
            name="wageRate"
            about="Ставка"
            register={register}
            error={errors.wageRate?.message ? errors.wageRate.message : null}
            defaultValue={props.vacancy?.wageRate}
          />
          <UIFormSelect
            name="education"
            label="Образование"
            data={educationList}
            defaultValue={props.vacancy?.education || ''}
            register={register}
            error={errors.education?.message ? errors.education.message : null}
            
          />
          <Button
            style={{ marginLeft: '15px', marginTop: '10px' }}
            variant="contained"
            color={'primary'}
            type="submit"
            disabled={!isValid}
            size="small"
          >
            {props.isEditMode ? 'Сохранить' : 'Добавить'}
          </Button>
        </Grid>
      </form>
    </Paper>
  );
};
