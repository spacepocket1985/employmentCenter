import React from 'react';
import EditSchedulePanel from '@components/schedule/editSchedulePanel';
import { useParams } from 'react-router-dom';

const ScheduleEditPage: React.FC = () => {
  const { id } = useParams();
  return <EditSchedulePanel scheduleId={id!} />;
};

export default ScheduleEditPage;
