import express from 'express';
import { scheduleController } from '../controllers/schedule.controller';

const router = express.Router();

// Основные маршруты для графиков
router
  .route('/')
  .post(scheduleController.createSchedule) // POST /api/schedules - создать график
  .get(scheduleController.getSchedules); // GET /api/schedules - получить все графики с фильтрами

// Быстрое создание графика из шаблона (автозаполнение сотрудниками)
router.post('/template', scheduleController.createScheduleFromTemplate); // POST /api/schedules/template

// Маршруты для конкретного графика
router
  .route('/:id')
  .get(scheduleController.getSchedule) // GET /api/schedules/:id - получить график по ID
  .patch(scheduleController.updateSchedule) // PATCH /api/schedules/:id - обновить график
  .delete(scheduleController.deleteSchedule); // DELETE /api/schedules/:id - удалить график

// Публикация/снятие с публикации графика
router.patch('/:id/publish', scheduleController.toggleSchedulePublish); // PATCH /api/schedules/:id/publish

// Получение графика по месяцу и типу
router.get(
  '/month/:month/type/:type',
  scheduleController.getScheduleByMonthAndType
); // GET /api/schedules/month/2024-01/type/responsibleOnWeekends

// Альтернативный маршрут для получения по месяцу и типу (более короткий)
router.get('/:month/:type', scheduleController.getScheduleByMonthAndType); // GET /api/schedules/2024-01/responsibleOnWeekends

export default router;
