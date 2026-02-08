import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid } from '@mui/material';

import { userActions, useLoginUserMutation } from '@store/slices/';
import { useAppDispatch } from '@hooks/storeHooks';
import { UIFormInput } from '@components/ui';

import {
  loginValidationSchema,
  userStorage,
  handleSucssestResult,
  handleError,
} from '@utils/index';
import { UserType } from 'src/types/types';

type UserAuthPropsType = {
  handleClose?: () => void;
};

export const UserAuth = (props: UserAuthPropsType): JSX.Element => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserType>({
    resolver: yupResolver(loginValidationSchema),
    mode: 'onChange',
  });

  const [loginUser] = useLoginUserMutation();
  const dispatch = useAppDispatch();

  const loginHandler: SubmitHandler<UserType> = async ({ name, password }) => {
    await loginUser({ name, password })
      .unwrap()
      .then((result) => {
        dispatch(userActions.logInUser(result.data));
        userStorage.saveUserInLocalStorage(result.data);
        handleSucssestResult(result);
      })
      .catch(handleError);

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
          label="Имя"
          control={control}
          
          error={errors.name?.message}
        />
        <UIFormInput
          type="password"
          name="password"
          label="Пароль"
          control={control}
          
          error={errors.password?.message}
        />
        <Button
          style={{ marginLeft: '15px', marginTop: '10px' }}
          variant="contained"
          color={'primary'}
          type="submit"
          disabled={!isValid}
        >
          Войти
        </Button>
      </Grid>
    </form>
  );
};
