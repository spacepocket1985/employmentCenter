import * as Yup from 'yup';

export const vacancyValidationSchema = Yup.object({
  title: Yup.string()
    .required('Поле обязательное')
    .min(2, 'Минимум три символа'),
  salary: Yup.number()
    .required('Поле обязательное')
    .typeError('Необходимо вести число')
    .min(0, 'Только положительные числа'),
  wageRate: Yup.number()
    .required('Поле обязательное')
    .typeError('Необходимо вести число')
    .min(0, 'No negative values'),
  education: Yup.string().required('Поле обязательное'),
  experience: Yup.string().required('Поле обязательное'),
});

export const loginValidationSchema = Yup.object({
  name: Yup.string()
    .required('Поле обязательное')
    .min(2, 'Минимум три символа'),
  password: Yup.string().required('Поле обязательное'),
});
