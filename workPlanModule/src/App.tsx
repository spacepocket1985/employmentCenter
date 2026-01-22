import React from 'react';

import WorkPlanView from './components/workPlanView';
import { usePlanDisplay } from '@hooks/usePlanDisplay';
import TodayEventsWithPlan from '@components/todayEventsWithPlan';

const App: React.FC = () => {
  const { plan, isLoading, error } = usePlanDisplay();

  return (
    <>
      <WorkPlanView plan={plan} isLoading={isLoading} error={error} />
      {/* <TodayEventsWithPlan plan={plan!} /> */}
    </>
  );
};

export default App;
