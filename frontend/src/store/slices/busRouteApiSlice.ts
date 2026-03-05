import { api, busRouteUrl } from '@store/config';
import {
  CreateBusRouteDTO,
  BusRouteApiResponse,
  BusRoutesApiResponse,
} from 'src/types/busRoute.types';

export const busRouteApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить все маршруты
    getBusRoutes: builder.query<BusRoutesApiResponse, void>({
      query: () => ({
        url: busRouteUrl,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'BusRoute' as const,
                id: _id,
              })),
              { type: 'BusRoute', id: 'LIST' },
            ]
          : [{ type: 'BusRoute', id: 'LIST' }],
    }),

    // Получить активные маршруты
    getActiveBusRoutes: builder.query<BusRoutesApiResponse, void>({
      query: () => ({
        url: `${busRouteUrl}?active=true`,
        method: 'GET',
      }),
      providesTags: [{ type: 'BusRoute', id: 'ACTIVE' }],
    }),

    // Получить маршрут по номеру
    getBusRoutesByNumber: builder.query<BusRoutesApiResponse, string>({
      query: (routeNumber) => ({
        url: `${busRouteUrl}?number=${routeNumber}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, routeNumber) => [
        { type: 'BusRoute', id: `NUMBER_${routeNumber}` },
      ],
    }),

    // Получить маршрут по ID
    getBusRoute: builder.query<BusRouteApiResponse, string>({
      query: (id) => ({
        url: `${busRouteUrl}/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'BusRoute', id }],
    }),

    // Создать маршрут
    createBusRoute: builder.mutation<BusRouteApiResponse, CreateBusRouteDTO>({
      query: (routeData) => ({
        url: busRouteUrl,
        method: 'POST',
        body: routeData,
      }),
      invalidatesTags: [
        { type: 'BusRoute', id: 'LIST' },
        { type: 'BusRoute', id: 'ACTIVE' },
      ],
    }),

    // Обновить маршрут
    updateBusRoute: builder.mutation<
      BusRouteApiResponse,
      { id: string; data: Partial<CreateBusRouteDTO> }
    >({
      query: ({ id, data }) => ({
        url: `${busRouteUrl}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'BusRoute', id },
        { type: 'BusRoute', id: 'LIST' },
        { type: 'BusRoute', id: 'ACTIVE' },
      ],
    }),

    // Удалить маршрут
    deleteBusRoute: builder.mutation<BusRouteApiResponse, string>({
      query: (id) => ({
        url: `${busRouteUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'BusRoute', id: 'LIST' },
        { type: 'BusRoute', id: 'ACTIVE' },
      ],
    }),

    // Переключить статус маршрута
    toggleBusRouteStatus: builder.mutation<
      BusRouteApiResponse,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `${busRouteUrl}/${id}/toggle-status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'BusRoute', id },
        { type: 'BusRoute', id: 'LIST' },
        { type: 'BusRoute', id: 'ACTIVE' },
      ],
    }),
  }),
});

export const {
  useGetBusRoutesQuery,
  useGetActiveBusRoutesQuery,
  useGetBusRoutesByNumberQuery,
  useGetBusRouteQuery,
  useCreateBusRouteMutation,
  useUpdateBusRouteMutation,
  useDeleteBusRouteMutation,
  useToggleBusRouteStatusMutation,
} = busRouteApi;
