import { Grid, TextField } from '@mui/material';
import React from 'react';

import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type UIFormInputPropsType<T extends FieldValues> = {
  type: React.HTMLInputTypeAttribute;
  name: Path<T>;
  about: string;
  register: UseFormRegister<T>;
  error: string | null;
  defaultValue?: string | number;
};

export const UIFormInput = <T extends FieldValues>(
  props: UIFormInputPropsType<T>
): JSX.Element => {
  const { type, name, register, error, about, defaultValue } = props;

  return (
    <Grid item xs="auto">
      <TextField
        type={type}
        variant={'standard'}
        label={about}
        id={name}
        required
        error={!!error}
        helperText={error}
        {...register(name)}
        defaultValue={defaultValue}
      />
    </Grid>
  );
};
