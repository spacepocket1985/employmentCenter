import { toast } from 'react-toastify';
import { ErrorDataType, InfoFromDBType } from '../types/types';

export const handleSucssestResult = <T>(result: InfoFromDBType<T>): void => {
  toast.info(result.msg, {
    position: 'top-left',
    autoClose: 2000,
  });
};

export const handleError = (error: ErrorDataType): void => {
  toast.error(`${error.data.message}. Код ошибки - ${error.status}`, {
    position: 'top-left',
    autoClose: 2000,
  });
};
