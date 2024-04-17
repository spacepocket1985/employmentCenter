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
  multiline?: boolean;
  maxRows?: number;
  gridSize?: number;
  fullWidth?: boolean
};

export const UIFormInput = <T extends FieldValues>(
  props: UIFormInputPropsType<T>
): JSX.Element => {
  const {
    type,
    name,
    register,
    error,
    about,
    defaultValue,
    multiline,
    maxRows,
    gridSize,
    
  } = props;

  return (
    <Grid item xs={gridSize || 'auto'}>
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
        multiline={multiline}
        maxRows={maxRows}
        fullWidth
      />
    </Grid>
  );
};
