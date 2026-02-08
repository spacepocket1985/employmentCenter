import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Paper, Box } from '@mui/material';

import { UIFormInput, UIFormSelect, UITitle } from '@components/ui';
import {
  handleSucssestResult,
  handleError,
  employeeValidationSchema,
  cutBDdate,
} from '@utils/index';

import { EmployeeType } from 'src/types/types';
import {
  useAddNewEmployeeMutation,
  useUpdateEmployeeMutation,
} from '@store/slices';
import { useAppSelector } from '@hooks/storeHooks';

type FormEditEmployeeType = Omit<EmployeeType, '_id'>;

type FormEditEmployeePropsType = {
  isEditMode?: boolean;
  employee?: EmployeeType;
  handleClose?: () => void;
};

export const FormEditEmployee: React.FC<FormEditEmployeePropsType> = (
  props
) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormEditEmployeeType>({
    resolver: yupResolver(employeeValidationSchema),
    mode: 'onChange',
  });

  const [addNewEmployee] = useAddNewEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const { department: workDepartment } = useAppSelector((state) => state.data);

  const addNewEmployeeHandler: SubmitHandler<FormEditEmployeeType> = async ({
    name,
    job,
    department,
    birthday,
  }) => {
    const newEmployee: FormEditEmployeeType = {
      name,
      job,
      department,
      birthday: cutBDdate(birthday),
    };

    if (props.isEditMode && props.handleClose) {
      await updateEmployee({
        name,
        job,
        department,
        birthday: cutBDdate(birthday),
        _id: props.employee?._id,
      })
        .unwrap()
        .then(handleSucssestResult)
        .catch(handleError);

      props.handleClose();
    } else {
      await addNewEmployee(newEmployee)
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
      <form onSubmit={handleSubmit(addNewEmployeeHandler)}>
        {/* Используем UITitle с переопределенными стилями */}
        <UITitle
          sx={{
            textAlign: 'center',
            justifyContent: 'center',
            backgroundColor: '#1976d2',
            color: 'white',
            mb: 3,
            fontSize: '1rem',
          }}
        >
          {!props.isEditMode
            ? 'Добавить нового сотрудника'
            : 'Редактировать данные'}
        </UITitle>

        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* Первая строка: ФИО и Должность */}
          <UIFormInput
            type="text"
            name="name"
            label="ФИО"
            control={control}
            error={errors.name?.message}
            defaultValue={props.employee?.name}
            gridSize={6}
            required
          />

          <UIFormInput
            type="text"
            name="job"
            label="Должность"
            control={control}
            error={errors.job?.message}
            defaultValue={props.employee?.job}
            gridSize={6}
            required
          />

          {/* Вторая строка: Подразделение и Дата рождения */}
          <UIFormSelect
            name="department"
            label="Подразделение"
            options={workDepartment}
            control={control}
            error={errors.department?.message}
            defaultValue={props.employee?.department}
            gridSize={6}
            required
          />

          <UIFormInput
            type="date"
            name="birthday"
            label="Дата рождения"
            control={control}
            error={errors.birthday?.message}
            textFieldProps={{
              InputLabelProps: { shrink: true },
            }}
            defaultValue={
              props.employee?.birthday
                ? cutBDdate(props.employee?.birthday)
                : ''
            }
            gridSize={6}
            required
          />

          {/* Кнопка отправки */}
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
