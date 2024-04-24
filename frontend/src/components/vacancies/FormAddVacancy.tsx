import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Paper } from '@mui/material';

import { useAppSelector } from '../../hooks/storeHooks';
import { UIFormInput } from '../ui/UIFormInput';

import { VacancyType } from '../../types/types';
import { UISimpleSelect } from '../ui/UISimpleSelect';
import { vacancyValidationSchema } from '../../utils/validationSchemes';
import {
  useAddNewVacancyMutation,
  useUpdateVacancyMutation,
} from '../../store/slices/vacanciesApiSlice';

import {
  handleSucssestResult,
  handleError,
} from '../../utils/handleRequestResult';

type FormAddVacancyType = {
  title: string;
  education: string;
  experience: string;
  salary: number;
  wageRate: number;
  additionalInformation: string;
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

  const [addNewVacancy] = useAddNewVacancyMutation();
  const [updateVacancy] = useUpdateVacancyMutation();

  const { education, experience } = useAppSelector((state) => state.data);

  const addNewVacancyHandler: SubmitHandler<VacancyType> = async ({
    title,
    salary,
    wageRate,
    education,
    experience,
    _id,
    additionalInformation,
  }) => {
    const newVacancy: VacancyType = {
      title,
      salary,
      wageRate,
      education,
      experience,
      _id,
      additionalInformation,
    };

    if (props.isEditMode && props.handleClose) {
      await updateVacancy({
        title,
        salary,
        wageRate,
        education,
        experience,
        _id: props.vacancy?._id,
        additionalInformation,
      })
        .unwrap()
        .then(handleSucssestResult)
        .catch(handleError);

      props.handleClose();
    } else {
      await addNewVacancy(newVacancy)
        .unwrap()
        .then(handleSucssestResult)
        .catch(handleError);
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
          justifyContent="flex-start"
          alignItems="center"
        >
          <UIFormInput
            type="text"
            name="title"
            about="Вакансия"
            register={register}
            error={errors.title?.message ? errors.title.message : null}
            defaultValue={props.vacancy?.title}
            gridSize={4}
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
            data={education}
            defaultValue={props.vacancy?.education}
            register={register}
            type={'string'}
            error={errors.education?.message ? errors.education.message : null}
          />
          <UISimpleSelect
            name="experience"
            label="Опыт работы"
            data={experience}
            defaultValue={props.vacancy?.experience}
            register={register}
            type={'string'}
            error={
              errors.experience?.message ? errors.experience.message : null
            }
          />

          <UIFormInput
            type="text"
            name="additionalInformation"
            about="Дополнительно"
            register={register}
            error={
              errors.additionalInformation?.message
                ? errors.additionalInformation.message
                : null
            }
            defaultValue={props.vacancy?.additionalInformation}
            multiline={true}
            maxRows={8}
            gridSize={6}
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
