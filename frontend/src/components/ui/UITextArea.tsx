import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import styles from './UITextArea.module.css';

type UITextAreaPropsType<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  error: string | null;
  defaultValue?: string;
};

export const UITextArea = <T extends FieldValues>(
  props: UITextAreaPropsType<T>
): JSX.Element => {
  const { name, register, label, error, defaultValue } = props;

  return (
  
    <div className={styles.selectWrapper}>
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        rows={5} cols={5}
        {...register(name)}
        defaultValue={defaultValue}
      >
       
      </textarea>
      <div>{error}</div>
    </div>
  );
};
