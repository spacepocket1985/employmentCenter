import React from 'react';
import {
  TextField,
  Autocomplete,
  Chip,
  Box,
  Popper,
  PopperProps,
  TextFieldProps,
} from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';

interface ResponsibleSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  TextFieldProps?: Partial<TextFieldProps>;
}

const CustomPopper = (props: PopperProps) => {
  return <Popper {...props} placement="bottom-start" />;
};

const ResponsibleSelect: React.FC<ResponsibleSelectProps> = ({
  value,
  onChange,
  label = 'Ответственные',
  disabled = false,
  TextFieldProps = {},
}) => {
  const { responsiblePersons } = useAppSelector((state) => state.data);
  const handleChange = (event: React.SyntheticEvent, newValue: string[]) => {
    onChange(newValue);
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      value={value}
      onChange={handleChange}
      options={responsiblePersons}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}

          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          sx={{
            '& .MuiInputBase-root': {
              alignItems: 'flex-start',
              minHeight: '56px',
            },
          }}
          {...TextFieldProps}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option}
            {...getTagProps({ index })}
            key={option}
            size="small"
          />
        ))
      }
      renderOption={(props, option) => (
        <li {...props} key={option}>
          <Box sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
            {option}
          </Box>
        </li>
      )}
      PopperComponent={CustomPopper}
    />
  );
};

export default ResponsibleSelect;
