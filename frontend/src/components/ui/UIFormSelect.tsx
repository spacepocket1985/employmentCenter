import { Grid, InputLabel, Select, MenuItem } from '@mui/material';

import { FieldValues, Path, UseFormRegister } from 'react-hook-form';


type UIFormSelectPropsType<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  error: string | null;
  data: Array<string>;
};

export const UIFormSelect = <T extends FieldValues>(
  props: UIFormSelectPropsType<T>
): JSX.Element => {
  const { data, name, label, register, error } = props;




  return (
    <Grid item xs="auto">
      <InputLabel style={{ textAlign:  'right', fontSize: '12px' }}>{label}</InputLabel>
      <Select
        size='small'
        variant={'standard'}
        id={name}
        required
        error={!!error}
        defaultValue={data[1]}
        
        {...register(name)}
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
