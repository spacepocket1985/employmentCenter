import { useParams } from 'react-router-dom';
import { EditBusRoutePanel } from "@components/busRoutes/editBusRoutePanel";

const BusRouteEditPage: React.FC = () => {
  const { id } = useParams();
  return <EditBusRoutePanel id={id!}/>;
};

export default BusRouteEditPage;
