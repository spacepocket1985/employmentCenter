import { ScheduleModel } from 'src/types/schedule.types';

type ScheduleProps = {
  schedule: ScheduleModel;
};
export const Schedule: React.FC<ScheduleProps> = ({ schedule }) => {
  console.log(schedule);
  return (
    <h2>
      <h2>{'schedule<'}</h2>
    </h2>
  );
};
