import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import styles from './UISimpleSelect.module.css';

type UISimpleSelectPropsType<T extends FieldValues> = {
  type: React.HTMLInputTypeAttribute;
  name: Path<T>;
  label: string;
  data: Array<string>;
  register: UseFormRegister<T>;
  error: string | null;
  defaultValue?: string | number;
};

export const UISimpleSelect = <T extends FieldValues>(
  props: UISimpleSelectPropsType<T>
): JSX.Element => {
  const { name, register, label, error, data, defaultValue } = props;

  const dataList = data.map((item, index) => (
    <option key={index} value={item}>
      {item}
    </option>
  ));

  return (
  
    <div className={styles.selectWrapper}>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        {...register(name)}
        defaultValue={defaultValue || data[0]}
      >
        {dataList}
      </select>
      <div>{error}</div>
    </div>
  );
};
