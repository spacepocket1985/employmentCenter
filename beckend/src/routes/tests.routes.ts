import express from 'express';
import { testController } from '../controllers/tests.controller';

const router = express.Router();

// Публичные маршруты (для пользователей)
router.route('/').get(testController.getAllTests);

router.route('/category/:category').get(testController.getTestsByCategory);

router.route('/:id').get(testController.getTestById);

router.route('/submit').post(testController.submitTestResults);

// Административные маршруты (для управления тестами)
router.route('/admin').post(testController.createTest);

router
  .route('/admin/:id')
  .patch(testController.updateTest)
  .delete(testController.deleteTest);

export default router;