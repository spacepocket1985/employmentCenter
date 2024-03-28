import { Grid, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';

import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type UIFormSelectPropsType<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  error: string | null;
  data: Array<string>;
  defaultValue?: string;
  resetSelect: boolean;
  onResetSelect: () => void;
};

export const UIFormSelect = <T extends FieldValues>(
  props: UIFormSelectPropsType<T>
): JSX.Element => {
  const {
    data,
    name,
    label,
    register,
    error,
    defaultValue,
    resetSelect,
    onResetSelect,
  } = props;
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');
  useEffect(() => {
    if (resetSelect) {
      setSelectedValue('');
      onResetSelect();
    }
  }, [onResetSelect, resetSelect]);

  return (
    <Grid item xs="auto">
      <InputLabel style={{ textAlign: 'right', fontSize: '12px' }}>
        {label}
      </InputLabel>

      <Select
        style={{ width: '150px' }}
        size="small"
        variant={'standard'}
        id={name}
        required
        error={!!error}
        value={selectedValue}
        {...register(name)}
        onChange={(event) => setSelectedValue(event.target.value)}
      >
        {data.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
      <div>{error}</div>
    </Grid>
  );
};
