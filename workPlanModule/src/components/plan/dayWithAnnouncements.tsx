import React from "react";
import { DayPlan, Announcement } from "src/types/plan.types";
import AnnouncementDisplay from "./announcementDisplay";
import NormalDayRow from "./normalDayRow";
import SpecialDayRow from "./specialDayRow";

export interface DayWithAnnouncementsProps {
  day: DayPlan;
  announcements: Announcement[];
}

export const DayWithAnnouncements: React.FC<DayWithAnnouncementsProps> = ({
  day,
  announcements,
}) => {
  return (
    <React.Fragment key={day.id}>
      {/* Отображаем анонсы для этого дня */}
      {announcements.map((announcement) => (
        <AnnouncementDisplay
          key={announcement.id}
          announcement={announcement}
          dayOfWeek={day.dayOfWeek}
        />
      ))}

      {/* Отображаем день */}
      {day.isSpecialDay ? (
        <SpecialDayRow day={day} />
      ) : (
        <NormalDayRow day={day} isFirstEvent={true} />
      )}
    </React.Fragment>
  );
};