/* eslint-disable @typescript-eslint/no-unused-vars */
import { InfoFromDBType } from 'src/types/types';

type AsyncThunkParams = {
  url: string;
  method: string;
  body?: object;
  successMessage: string;
  errorMessage: string;
};

export const handleAsyncThunk = async <T>(
  params: AsyncThunkParams,
  thunkAPI: {
    dispatch: (action: unknown) => void;
  }
): Promise<T> => {
  try {
    const response = await fetch(params.url, {
      method: params.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: params.body ? JSON.stringify(params.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(params.errorMessage);
    }

    const responseData: InfoFromDBType<T> = await response.json();

    return responseData.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    return [] as T;
  }
};
