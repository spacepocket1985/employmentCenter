import WorkPlanList from '@components/plan/workPlanList';
import WorkPlanPanel from '@components/plan/workPlanPanel';
import WorkPlanView from '@components/plan/workPlanView';

const PlanPage: React.FC = () => {
  return (<>
  <WorkPlanPanel />
  <WorkPlanList/>
  <WorkPlanView planId='696a2ee26182849cb8ce45ae'/>
  </>);
};

export default PlanPage;
