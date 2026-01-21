import {
  DayPlan,
  LocalDayPlan,
  Announcement,
  LocalAnnouncement,
  Event,
  LocalEvent
} from 'src/types/workPlan.types';

/**
 * Конвертирует локальный день плана в формат сервера
 */
export const convertLocalDayToServer = (localDay: LocalDayPlan): DayPlan => ({
  id: localDay.id,
  dayNumber: localDay.dayNumber,
  dayOfWeek: localDay.dayOfWeek,
  isSpecialDay: localDay.isSpecialDay,
  specialDayTitle: localDay.specialDayTitle,
  events: localDay.events.map(convertLocalEventToServer)
});

/**
 * Конвертирует локальное событие в формат сервера
 */
export const convertLocalEventToServer = (localEvent: LocalEvent): Event => ({
  id: localEvent.id,
  time: localEvent.time,
  description: localEvent.description,
  responsiblePersons: localEvent.responsiblePersons,
  notes: localEvent.notes
});

/**
 * Конвертирует локальный анонс в формат сервера
 */
export const convertLocalAnnouncementToServer = (
  localAnnouncement: LocalAnnouncement
): Announcement => ({
  id: localAnnouncement.id,
  dayNumber: localAnnouncement.dayNumber,
  title: localAnnouncement.title,
  style: localAnnouncement.style,
  order: localAnnouncement.order
});

/**
 * Конвертирует серверный день плана в локальный формат
 */
export const convertServerDayToLocal = (serverDay: DayPlan): LocalDayPlan => ({
  id: serverDay.id,
  dayNumber: serverDay.dayNumber,
  dayOfWeek: serverDay.dayOfWeek,
  isSpecialDay: serverDay.isSpecialDay || false,
  specialDayTitle: serverDay.specialDayTitle || '',
  events: serverDay.events.map(convertServerEventToLocal)
});

/**
 * Конвертирует серверное событие в локальный формат
 */
export const convertServerEventToLocal = (serverEvent: Event): LocalEvent => ({
  id: serverEvent.id,
  time: serverEvent.time,
  description: serverEvent.description,
  responsiblePersons: serverEvent.responsiblePersons || [],
  notes: serverEvent.notes
});

/**
 * Конвертирует серверный анонс в локальный формат
 */
export const convertServerAnnouncementToLocal = (
  serverAnnouncement: Announcement
): LocalAnnouncement => ({
  id: serverAnnouncement.id,
  dayNumber: serverAnnouncement.dayNumber,
  title: serverAnnouncement.title,
  style: serverAnnouncement.style,
  order: serverAnnouncement.order || 0
});

/**
 * Конвертирует массив серверных дней в локальный формат
 */
export const convertServerDaysToLocal = (serverDays: DayPlan[]): LocalDayPlan[] => {
  return serverDays.map(convertServerDayToLocal);
};

/**
 * Конвертирует массив серверных анонсов в локальный формат
 */
export const convertServerAnnouncementsToLocal = (
  serverAnnouncements: Announcement[]
): LocalAnnouncement[] => {
  return serverAnnouncements.map(convertServerAnnouncementToLocal);
};