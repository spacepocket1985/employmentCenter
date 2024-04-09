import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid } from '@mui/material';

import { useAppDispatch } from '../../hooks/storeHooks';

import { UIFormInput } from '../ui/UIFormInput';

import { loginValidationSchema } from '../../utils/validationSchemes';
import { UserType } from '../../types/types';
import { login } from '../../store/slices/userSlice';

type UserAuthPropsType = {
  handleClose?: () => void;
};

export const UserAuth = (props: UserAuthPropsType): JSX.Element => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserType>({
    resolver: yupResolver(loginValidationSchema),
    mode: 'onChange',
  });

  const dispatch = useAppDispatch();



  const loginHandler: SubmitHandler<UserType> = async ({
    name,
    password,
  }) => {
    await dispatch(login({name,password}))
    if (props.handleClose) props.handleClose();

    reset();
  };

  return (
    <form onSubmit={handleSubmit(loginHandler)}>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <UIFormInput
          type="text"
          name="name"
          about="Имя"
          register={register}
          error={errors.name?.message ? errors.name.message : null}
        />
        <UIFormInput
          type="text"
          name="password"
          about="Пароль"
          register={register}
          error={errors.password?.message ? errors.password.message : null}
        />
        <Button
          style={{ marginLeft: '15px', marginTop: '10px' }}
          variant="contained"
          color={'primary'}
          type="submit"
          disabled={!isValid}
          size="small"
        >
          Войти
        </Button>
      </Grid>
    </form>
  );
};
