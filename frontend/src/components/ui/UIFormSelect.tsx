import {
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
  FormControl,
} from '@mui/material';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form';

interface SelectOption {
  value: string | number;
  label: string;
}

interface UIFormSelectProps<T extends FieldValues> {
  /** Имя поля в форме */
  name: Path<T>;
  /** Контроллер react-hook-form */
  control: Control<T>;
  /** Заголовок поля */
  label: string;
  /** Список опций для выбора (может быть массивом строк или объектов) */
  options: SelectOption[] | string[];
  /** Ошибка валидации (если передается извне) */
  error?: string;
  /** Значение по умолчанию */
  defaultValue?: string | number;
  /** Дополнительные пропсы для Select */
  selectProps?: Partial<SelectProps>;
  /** Размер в grid системе */
  gridSize?: number;
  /** Обязательное поле */
  required?: boolean;
  /** Отключенное состояние */
  disabled?: boolean;
  /** Вариант отображения */
  variant?: 'standard' | 'outlined' | 'filled';
}

/**
 * Универсальный компонент выпадающего списка с интеграцией react-hook-form
 */
export const UIFormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  error,
  defaultValue,
  selectProps,
  gridSize = 6,
  required = true,
  disabled = false,
  variant = 'standard',
}: UIFormSelectProps<T>): JSX.Element => {
  // Нормализуем опции: если пришел массив строк, преобразуем в объекты
  const normalizedOptions: SelectOption[] =
    Array.isArray(options) && options.length > 0
      ? typeof options[0] === 'string'
        ? (options as string[]).map((option) => ({
            value: option,
            label: option,
          }))
        : (options as SelectOption[])
      : [];

  return (
    <Grid item xs={gridSize}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue as never}
        render={({ field, fieldState }): JSX.Element => {
          const fieldError: FieldError | undefined = fieldState.error;
          const errorMessage: string = fieldError?.message || error || '';

          return (
            <FormControl
              fullWidth
              error={!!fieldError || !!error}
              required={required}
              disabled={disabled}
              variant={variant}
            >
              <InputLabel>{label}</InputLabel>
              <Select {...field} label={label} size="small" {...selectProps}>
                {normalizedOptions.map((option, index) => (
                  <MenuItem
                    key={`${option.value}-${index}`}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {(fieldError || error) && (
                <FormHelperText error>{errorMessage}</FormHelperText>
              )}
            </FormControl>
          );
        }}
      />
    </Grid>
  );
};
