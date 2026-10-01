import express from 'express';
import { employeeController } from '../controllers/employee.controller';

const router = express.Router();

// ============================================
// БАЗОВЫЕ МАРШРУТЫ
// ============================================
router
  .route('/')
  .post(employeeController.createEmployee)
  .get(employeeController.getAllEmployees);

// ============================================
// СПЕЦИАЛЬНЫЕ МАРШРУТЫ
// ============================================
router.route('/hb').get(employeeController.getEmployeesHB);
router.route('/search/:name').get(employeeController.getEmployeeByName);

// ============================================
// НОВЫЙ МАРШРУТ: Список мастеров
// ВАЖНО: должен быть ДО маршрута '/:id', иначе 'masters' будет воспринят как id
// ============================================
router.route('/masters').get(employeeController.getMasters);

// ============================================
// МАРШРУТЫ ДЛЯ РАБОТЫ С ГРУППАМИ
// ============================================
router
  .route('/responsibleOnWeekends')
  .get(employeeController.getResponsibleOnWeekends);
router.route('/safetyOfficers').get(employeeController.getSafetyOfficers);
router.route('/group/:groupName').get(employeeController.getEmployeesByGroup);

// ============================================
// МАРШРУТЫ ДЛЯ КОНКРЕТНОГО СОТРУДНИКА
// ============================================
router
  .route('/:id')
  .get(employeeController.getEmployee)
  .patch(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

// ============================================
// МАРШРУТЫ ДЛЯ УПРАВЛЕНИЯ ГРУППАМИ СОТРУДНИКА
// ============================================
router
  .route('/:id/groups/:groupName')
  .patch(employeeController.addGroupToEmployee)
  .delete(employeeController.removeGroupFromEmployee);

export default router;