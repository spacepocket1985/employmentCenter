import { Chip } from '@mui/material';
import { getDayTypeDisplay } from '@utils/busRouteUtils';
import { DayType } from 'src/types/busRoute.types';

type BusRouteDayTypeProps = { daysType: DayType[] };
export const BusRouteDayType: React.FC<BusRouteDayTypeProps> = ({
  daysType,
}) => {
  return (
    <>
      {daysType.map((dayType, index) => {
        return (
          <Chip
            label={getDayTypeDisplay(dayType)}
            key={`dayType ${index}`}
            color="success"
          />
        );
      })}
    </>
  );
};
