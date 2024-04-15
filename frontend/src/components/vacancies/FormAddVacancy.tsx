import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Paper } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import {
  addNewVacancyToDB,
  updateVacancyFromDB,
} from '../../store/slices/vacanciesSlice';
import { UIFormInput } from '../ui/UIFormInput';

import { VacancyType } from '../../types/types';
import { UISimpleSelect } from '../ui/UISimpleSelect';
import { vacancyValidationSchema } from '../../utils/validationSchemes';

type FormAddVacancyType = {
  title: string;
  education: string;
  experience: string;
  salary: number;
  wageRate: number;
};

type FormAddVacancyPropsType = {
  isEditMode?: boolean;
  vacancy?: VacancyType;
  handleClose?: () => void;
};

export const FormAddVacancy = (props: FormAddVacancyPropsType): JSX.Element => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormAddVacancyType>({
    resolver: yupResolver(vacancyValidationSchema),
    mode: 'onChange',
  });

  const dispatch = useAppDispatch();

  const educationList = useAppSelector((state) => state.data.education);
  const experienceList = useAppSelector((state) => state.data.experience);

  const addNewVacancyHandler: SubmitHandler<VacancyType> = async ({
    title,
    salary,
    wageRate,
    education,
    experience,
    _id,
  }) => {
    const newVacancy: VacancyType = {
      title,
      salary,
      wageRate,
      education,
      experience,
      _id,
    };

    if (props.isEditMode && props.handleClose) {
      await dispatch(
        updateVacancyFromDB({
          title,
          salary,
          wageRate,
          education,
          experience,
          _id: props.vacancy?._id,
        })
      );
      props.handleClose();
    } else {
      await dispatch(addNewVacancyToDB(newVacancy));
    }

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
          <UISimpleSelect
            name="education"
            label="Образование"
            data={educationList}
            defaultValue={props.vacancy?.education}
            register={register}
            type={'string'}
            error={errors.education?.message ? errors.education.message : null}
          />
          <UISimpleSelect
            name="experience"
            label="Опыт работы"
            data={experienceList}
            defaultValue={props.vacancy?.experience}
            register={register}
            type={'string'}
            error={
              errors.experience?.message ? errors.experience.message : null
            }
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
