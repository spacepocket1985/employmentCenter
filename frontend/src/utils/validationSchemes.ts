import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Поле обязательное')
    .min(2, 'Минимум три символа'),
  salary: Yup.number()
    .required('Поле обязательное')
    .typeError('Salary should be number')
    .min(0, 'No negative values'),
  wageRate: Yup.number()
    .required('Поле обязательное')
    .typeError('WageRate should be number')
    .min(0, 'No negative values'),
  education: Yup.string().required('Поле обязательное'),
  experience: Yup.string().required('Поле обязательное'),
});

export default validationSchema;
