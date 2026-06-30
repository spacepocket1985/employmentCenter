import React, { useState, useMemo } from 'react';
import { LoadingErrorWrapper } from '@components/layout/loadingErrorWrapper';
import { Stack } from '@mui/material';
import { useApi } from '@hooks/useApi';
import { busRouteEndpoint } from '@api/endPoints';

import { BusRoute } from './busRoute';
import { BusRoutesApiResponse, BusRouteModel } from 'src/types/busRoute.types';
import RouteFilter from './routeFilter';
import { MainTitle } from '@components/layout/mainTitle';

type BusRouteListProps = {
  showPrintButton?: boolean;
  printTitle?: string;
};

export const BusRouteList: React.FC<BusRouteListProps> = ({
  printTitle = 'Расписание движения транспорта Гродненской ТЭЦ-2',
}) => {
  const { data, loading, error, refetch } = useApi<BusRoutesApiResponse>(
    busRouteEndpoint,
    { method: 'GET' },
    { autoLoad: true }
  );

  // Оборачиваем busRoutes в useMemo, чтобы стабилизировать ссылку
  const busRoutes = useMemo(() => data?.data || [], [data]);

  // Состояния для фильтрации
  const [filterType, setFilterType] = useState<'all' | 'route'>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Преобразуем маршруты в формат для фильтра
  const routeOptions = useMemo(() => {
    return busRoutes.map((route: BusRouteModel) => ({
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      routeId: route._id, // Используем _id как уникальный идентификатор
    }));
  }, [busRoutes]);

  // Фильтруем маршруты на основе выбранного фильтра
  const filteredRoutes = useMemo(() => {
    if (filterType === 'all' || !selectedRouteId) {
      return busRoutes; // Показываем все маршруты
    }
    // Фильтруем по ID выбранного маршрута
    return busRoutes.filter(
      (route: BusRouteModel) => route._id === selectedRouteId
    );
  }, [busRoutes, filterType, selectedRouteId]); // busRoutes стабилен

  // Обработчики для фильтра
  const handleFilterTypeChange = (type: 'all' | 'route') => {
    setFilterType(type);
  };

  const handleRouteChange = (routeId: string | null) => {
    setSelectedRouteId(routeId);
  };

  return (
    <LoadingErrorWrapper
      isLoading={loading}
      error={error}
      onRetry={refetch}
      collectionLength={filteredRoutes.length}
      collectionTitle=" графиков дежурств"
      printDocumentTitle={printTitle}
    >
      <MainTitle title="Маршруты движения транспорта" />

      {/* Добавляем компонент фильтра */}
      <RouteFilter
        routes={routeOptions}
        filterType={filterType}
        selectedRoute={selectedRouteId}
        onFilterTypeChange={handleFilterTypeChange}
        onRouteChange={handleRouteChange}
      />

      <Stack spacing={3} direction={'column'}>
        {filteredRoutes.map((item: BusRouteModel) => (
          <BusRoute key={item._id} busRoute={item} />
        ))}
      </Stack>
    </LoadingErrorWrapper>
  );
};
