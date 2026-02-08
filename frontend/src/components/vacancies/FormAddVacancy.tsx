import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Paper, Box } from '@mui/material';

import { useAppSelector } from '@hooks/storeHooks';
import { UIFormInput, UIFormSelect, UITitle } from '@components/ui';
import {
  handleSucssestResult,
  handleError,
  vacancyValidationSchema,
} from '@utils/index';
import {
  useAddNewVacancyMutation,
  useUpdateVacancyMutation,
} from '@store/slices/vacanciesApiSlice';
import { VacancyType } from 'src/types/types';

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
    control,
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
    additionalInformation,
  }) => {
    const newVacancy: VacancyType = {
      title,
      salary,
      wageRate,
      education,
      experience,
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
      sx={{ margin: 'auto', padding: 3, maxWidth: 800 }}
    >
      <form onSubmit={handleSubmit(addNewVacancyHandler)}>
        <UITitle
          sx={{
            textAlign: 'center',
            justifyContent: 'center',
            backgroundColor: '#1976d2',
            color: 'white',
            mb: 3,
          }}
        >
          {!props.isEditMode ? 'Добавить вакансию' : 'Редактировать вакансию'}
        </UITitle>

        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Первая строка: Вакансия и Зарплата */}
          <UIFormInput
            type="text"
            name="title"
            label="Вакансия"
            control={control}
            error={errors.title?.message}
            defaultValue={props.vacancy?.title}
            gridSize={6}
            required
          />

          <UIFormInput
            type="number"
            name="salary"
            label="Зарплата"
            control={control}
            error={errors.salary?.message}
            defaultValue={props.vacancy?.salary}
            gridSize={6}
            required
          />

          {/* Вторая строка: Ставка и Образование */}
          <UIFormInput
            type="number"
            name="wageRate"
            label="Ставка"
            control={control}
            error={errors.wageRate?.message}
            defaultValue={props.vacancy?.wageRate}
            gridSize={6}
            required
          />

          <UIFormSelect
            name="education"
            label="Образование"
            options={education}
            control={control}
            error={errors.education?.message}
            defaultValue={props.vacancy?.education}
            gridSize={6}
            required
          />

          {/* Третья строка: Опыт работы */}
          <UIFormSelect
            name="experience"
            label="Опыт работы"
            options={experience}
            control={control}
            error={errors.experience?.message}
            defaultValue={props.vacancy?.experience}
            gridSize={6}
            required
          />

          {/* Дополнительная информация - занимает всю ширину */}
          <UIFormInput
            type="text"
            name="additionalInformation"
            label="Дополнительная информация"
            control={control}
            error={errors.additionalInformation?.message}
            defaultValue={props.vacancy?.additionalInformation}
            multiline={true}
            rows={4}
            maxRows={8}
            gridSize={12}
          />

          {/* Кнопки */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isValid}
                size="medium"
                sx={{ minWidth: 120 }}
              >
                {props.isEditMode ? 'Сохранить' : 'Добавить'}
              </Button>

              {props.handleClose && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={props.handleClose}
                  size="medium"
                  sx={{ ml: 2, minWidth: 120 }}
                >
                  Отмена
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
