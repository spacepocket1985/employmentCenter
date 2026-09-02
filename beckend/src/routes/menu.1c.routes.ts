
import { Router } from 'express';
import { menuOneCController } from '../controllers/menu.1c.controller';


const router = Router();

/**
 * GET /food-menu
 * Получение меню из 1С с фильтрацией по дате
 * 
 * Query параметры:
 * - period: 'week' | 'month'
 * - dateFrom: DD.MM.YYYY
 * - dateTo: DD.MM.YYYY
 */
router.get('/', (req, res) => {
  menuOneCController.getMenuFromOneC(req, res);
});

export default router;