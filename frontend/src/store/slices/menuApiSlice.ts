import {
  api,
  foodMenuClearUrl,
  foodMenuStatusUrl,
  foodMenuUploadUrl,
  foodMenuUrl,
} from '@store/config';

import {
  ApiResponse,
  Menu,
  MenuStatus,
  UploadResult,
  ClearResult,
} from 'src/types/menu.types';

export const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить меню
    getMenu: builder.query<ApiResponse<Menu>, void>({
      query: () => ({
        url: foodMenuUrl,
        method: 'GET',
      }),
      providesTags: ['Menu'],
    }),

    // Получить статус меню
    getMenuStatus: builder.query<ApiResponse<MenuStatus>, void>({
      query: () => ({
        url: foodMenuStatusUrl,
        method: 'GET',
      }),
      providesTags: ['Menu'],
    }),

    // Загрузить CSV файл с меню
    uploadMenu: builder.mutation<ApiResponse<UploadResult>, FormData>({
      query: (formData) => ({
        url: foodMenuUploadUrl,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Menu'],
    }),

    // Очистить всё меню
    clearMenu: builder.mutation<ApiResponse<ClearResult>, void>({
      query: () => ({
        url: foodMenuClearUrl,
        method: 'DELETE',
      }),
      invalidatesTags: ['Menu'],
    }),
    getMenuDisplay: builder.query<ApiResponse<Menu>, void>({
      query: () => ({
        url: foodMenuUrl,
        method: 'GET',
      }),
      providesTags: ['Menu'],
    }),
  }),
});

export const {
  useGetMenuQuery,
  useGetMenuStatusQuery,
  useUploadMenuMutation,
  useClearMenuMutation,
  useGetMenuDisplayQuery,
} = menuApi;
