import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Paper } from '@mui/material';

import { UIFormInput, UISimpleSelect, UITitle } from '@components/ui';
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
    register,
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

  const addNewEmployeeHandler: SubmitHandler<EmployeeType> = async ({
    name,
    job,
    department,
    birthday,
  }) => {
    const newEmployee: EmployeeType = {
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
      style={{ margin: 'auto', padding: '10px' }}
    >
      <Box></Box>
      <form onSubmit={handleSubmit(addNewEmployeeHandler)}>
        <UITitle>
          {!props.isEditMode
            ? 'Добавить нового сотрудника'
            : 'Редактировать данные'}
        </UITitle>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <UIFormInput
            type="text"
            name="name"
            about="ФИО"
            register={register}
            error={errors.name?.message ? errors.name.message : null}
            defaultValue={props.employee?.name}
            gridSize={4}
          />
          <UIFormInput
            type="text"
            name="job"
            about="Должность"
            register={register}
            error={errors.job?.message ? errors.job.message : null}
            defaultValue={props.employee?.job}
          />

          <UISimpleSelect
            name="department"
            label="Подразделение"
            data={workDepartment}
            defaultValue={props.employee?.department}
            register={register}
            type={'string'}
            error={
              errors.department?.message ? errors.department.message : null
            }
          />

          <UIFormInput
            type="date"
            name="birthday"
            about=""
            register={register}
            error={errors.birthday?.message ? errors.birthday.message : null}
            defaultValue={
              props.employee?.birthday
                ? cutBDdate(props.employee?.birthday)
                : ''
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
