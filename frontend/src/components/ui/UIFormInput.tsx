import { Grid, TextField, TextFieldProps } from '@mui/material';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldError,
} from 'react-hook-form';
import React from 'react';

interface UIFormInputProps<T extends FieldValues> {
  /** Имя поля в форме */
  name: Path<T>;
  /** Контроллер react-hook-form */
  control: Control<T>;
  /** Заголовок поля */
  label?: string;
  /** Тип input элемента */
  type?: React.HTMLInputTypeAttribute;
  /** Ошибка валидации (если передается извне) */
  error?: string;
  /** Значение по умолчанию */
  defaultValue?: string | number;
  /** Многострочный режим */
  multiline?: boolean;
  /** Количество строк (для multiline) */
  rows?: number;
  /** Максимальное количество строк */
  maxRows?: number;
  /** Минимальное количество строк */
  minRows?: number;
  /** Размер в grid системе */
  gridSize?: number;
  /** Дополнительные пропсы для TextField */
  textFieldProps?: Partial<TextFieldProps>;
  /** Обязательное поле */
  required?: boolean;
  /** Отключенное состояние */
  disabled?: boolean;
}

/**
 * Универсальный компонент текстового поля с интеграцией react-hook-form
 */
export const UIFormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  error,
  defaultValue,
  multiline = false,
  rows,
  minRows,
  maxRows,
  gridSize = 12,
  textFieldProps,
  required = true,
  disabled = false,
}: UIFormInputProps<T>): JSX.Element => {
  return (
    <Grid item xs={gridSize}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue as never}
        render={({ field, fieldState }): JSX.Element => {
          const fieldError: FieldError | undefined = fieldState.error;
          const errorMessage: string = fieldError?.message || error || '';
          const fieldValue = field.value === undefined ? '' : field.value;
          return (
            <TextField
              {...field}
              value={fieldValue}
              type={type}
              variant="outlined"
              label={label}
              required={required}
              error={!!fieldError || !!error}
              helperText={errorMessage}
              multiline={multiline}
              rows={rows}
              minRows={minRows || rows}
              maxRows={maxRows}
              fullWidth
              disabled={disabled}
              {...textFieldProps}
            />
          );
        }}
      />
    </Grid>
  );
};
