import { Grid, TextField } from '@mui/material';
import React from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type UIFormInputPropsType<T extends FieldValues> = {
  type: React.HTMLInputTypeAttribute;
  name: Path<T>;
  about: string
  register: UseFormRegister<T>;
  error: string | null;
  required: boolean
};

export const UIFormInput = <T extends FieldValues>(
  props: UIFormInputPropsType<T>
): JSX.Element => {
  const { type, name, register, required, error, about } = props;
  return (
    <Grid item xs="auto">
      <TextField
        type={type}
        variant={'standard'}
        label={about}
        id={name}
        error={!!error}
        helperText={error}
        {...register(name, { required })}
      />
    </Grid>
  );
};
