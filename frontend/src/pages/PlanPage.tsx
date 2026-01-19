import WorkPlanView from '@components/plan/workPlanView';
import { useParams } from 'react-router-dom';

const PlanPage: React.FC = () => {
  const { id } = useParams();

  if (!id) return;
  return (
    <>
      <WorkPlanView planId={id} />
    </>
  );
};

export default PlanPage;
