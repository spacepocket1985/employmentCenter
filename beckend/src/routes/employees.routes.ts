import express from 'express';
import { employeeController } from '../controllers/employee.controller';

const router = express.Router();

// Базовые маршруты
router
  .route('/')
  .post(employeeController.createEmployee)
  .get(employeeController.getAllEmployees);

// Специальные маршруты
router.route('/hb').get(employeeController.getEmployeesHB);
router.route('/search/:name').get(employeeController.getEmployeeByName);

// Маршруты для работы с группами
router
  .route('/responsible-on-weekends')
  .get(employeeController.getResponsibleOnWeekends);
router.route('/safety-officers').get(employeeController.getSafetyOfficers);
router.route('/group/:groupName').get(employeeController.getEmployeesByGroup);

// Маршруты для работы с конкретным сотрудником
router
  .route('/:id')
  .get(employeeController.getEmployee)
  .patch(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

// Маршруты для управления группами сотрудника
router
  .route('/:id/groups/:groupName')
  .patch(employeeController.addGroupToEmployee)
  .delete(employeeController.removeGroupFromEmployee);

export default router;
