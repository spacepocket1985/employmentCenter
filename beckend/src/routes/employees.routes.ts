import express from 'express';
import { employeeController } from '../controllers/employee.controller';

const router = express.Router();

router
  .route('/')
  .post(employeeController.createEmployee)
  .get(employeeController.getAllEmployees);

router.route('/hb').get(employeeController.getEmployeesHB);
router.route('/search/:name').get(employeeController.getEmployeeByName);

router
  .route('/:id')
  .get(employeeController.getEmployee)
  .patch(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

export default router;
