import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetScheduleQuery } from '@store/slices';
import { LoadingErrorWrapper } from '@components/layout';
import { Schedule } from '@components/schedule/schedule';

const SchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: scheduleData,
    isLoading,
    error,
  } = useGetScheduleQuery(id!, {
    skip: !id,
  });

  console.log(scheduleData)

  // const initialData = {
  //   monthNumber: planData.data.monthNumber,
  //   year: planData.data.year,
  //   days: planData.data.days,
  //   announcements: planData.data.announcements || [],
  //   workingSaturdays: planData.data.workingSaturdays || [],
  // };

  return (
    <LoadingErrorWrapper isLoading={isLoading} error={error}>
      <Schedule schedule={scheduleData!.data!} />
    </LoadingErrorWrapper>
  );
};

export default SchedulePage;
