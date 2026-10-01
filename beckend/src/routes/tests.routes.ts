import express from 'express';
import { testController } from '../controllers/tests.controller';

const router = express.Router();

// ============================================
// ВАЖНО: Специфичные маршруты ДО общих
// ============================================

// ============================================
// ПРОСМОТР РЕЗУЛЬТАТОВ (сессии)
// ============================================

// Получение всех сессий с фильтрацией
router.route('/sessions').get(testController.getTestSessions);

// Получение статистики по сессиям
router.route('/sessions/stats').get(testController.getTestSessionsStats);

// Получение сессий конкретного сотрудника
router
  .route('/sessions/employee/:employeeId')
  .get(testController.getTestSessionsByEmployee);

// Получение сессий по конкретному тесту
router
  .route('/sessions/test/:testId')
  .get(testController.getTestSessionsByTest);

// Получение одной сессии по ID
router.route('/sessions/:id').get(testController.getTestSessionById);

// ============================================
// ПУБЛИЧНЫЕ МАРШРУТЫ (для пользователей)
// ============================================

router.route('/').get(testController.getAllTests);

router.route('/category/:category').get(testController.getTestsByCategory);

router.route('/submit').post(testController.submitTestResults);

router.route('/:id').get(testController.getTestById);

// ============================================
// АДМИНИСТРАТИВНЫЕ МАРШРУТЫ
// ============================================

router.route('/admin').post(testController.createTest);

router
  .route('/admin/:id')
  .patch(testController.updateTest)
  .delete(testController.deleteTest);

export default router;
