import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Grid,
  RadioGroupProps,
} from '@mui/material';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form';

interface RadioOption {
  value: string;
  label: string;
}

interface UIFormRadioProps<T extends FieldValues> {
  /** Имя поля в форме */
  name: Path<T>;
  /** Контроллер react-hook-form */
  control: Control<T>;
  /** Заголовок группы */
  label?: string;
  /** Список опций */
  options: RadioOption[];
  /** Ошибка валидации */
  error?: string;
  /** Расположение кнопок (row или column) */
  row?: boolean;
  /** Дополнительные пропсы для RadioGroup */
  radioGroupProps?: Partial<RadioGroupProps>;
  /** Размер в grid системе */
  gridSize?: number;
  /** Отключенное состояние */
  disabled?: boolean;
}

/**
 * Универсальный компонент группы радиокнопок с интеграцией react-hook-form
 */
export const UIFormRadio = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  error,
  row = true,
  radioGroupProps,
  gridSize = 12,
  disabled = false,
}: UIFormRadioProps<T>): JSX.Element => {
  return (
    <Grid item xs={gridSize}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }): JSX.Element => {
          const fieldError: FieldError | undefined = fieldState.error;
          const errorMessage: string = fieldError?.message || error || '';

          return (
            <FormControl
              component="fieldset"
              error={!!fieldError || !!error}
              disabled={disabled}
              fullWidth
            >
              <FormLabel component="legend" sx={{ mb: 1 }}>
                {label}
              </FormLabel>
              <RadioGroup {...field} row={row} {...radioGroupProps}>
                {options.map((option: RadioOption) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              {(fieldError || error) && (
                <FormHelperText>{errorMessage}</FormHelperText>
              )}
            </FormControl>
          );
        }}
      />
    </Grid>
  );
};
