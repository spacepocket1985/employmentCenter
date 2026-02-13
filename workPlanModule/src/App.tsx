import React from 'react';

import TodayEventsWithPlan from '@components/plan/todayEventsWithPlan';
import WorkPlanView from '@components/plan/workPlanView';
import { LoadingErrorWrapper } from '@components/layout/loadingErrorWrapper';
import { usePlanData } from '@hooks/usePlanData';

const App: React.FC = () => {
  const {
    data: plan,
    isLoading: isLoadingPlan,
    error: errorPlan,
  } = usePlanData();

  return (
    <>
      <LoadingErrorWrapper isLoading={isLoadingPlan} error={errorPlan}>
        <WorkPlanView plan={plan} />
      </LoadingErrorWrapper>
      {/* <TodayEventsWithPlan plan={plan!}/> */}
    </>
  );
};

export default App;
