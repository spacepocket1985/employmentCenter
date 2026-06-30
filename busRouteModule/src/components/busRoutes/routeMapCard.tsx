import { tec2Url } from '@api/baseUrl';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';

type RouteMapCardProps = {
  routeMap: string;
  routeNumber: string;
  routeName?: string;
  description?: string;
};
export const RouteMapCard: React.FC<RouteMapCardProps> = ({
  routeMap,
  routeNumber,
  routeName,
  description,
}) => {
  const imageUrl = `${tec2Url}/images/routeMaps/${routeMap}`;
  return (
    <Card>
      <CardActionArea>
        <CardMedia component="img" image={imageUrl} alt="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {`${routeName} №${routeNumber}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
