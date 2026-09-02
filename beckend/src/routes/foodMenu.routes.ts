import { Router } from 'express';
import { foodMenuController } from '../controllers/foodMenu.controller';
import { mealDealController } from '../controllers/mealDeal.controller';

const router = Router();

// ============================================================
// === СУЩЕСТВУЮЩИЕ РОУТЫ (меню) ===
// ============================================================

/**
 * GET /food-menu/week
 * Меню на текущую неделю (пн-пт)
 */
router.get('/week', (req, res) => {
  foodMenuController.getCurrentWeekMenu(req, res);
});

/**
 * GET /food-menu/full-week
 * Меню с понедельника по следующий понедельник
 */
router.get('/full-week', (req, res) => {
  foodMenuController.getFullWeekMenu(req, res);
});

/**
 * GET /food-menu/date
 * Меню на конкретную дату
 * Query: ?date=27.08.26
 */
router.get('/date', (req, res) => {
  foodMenuController.getMenuByDate(req, res);
});

/**
 * GET /food-menu/status
 * Статус меню (количество дней и блюд)
 */
router.get('/status', (req, res) => {
  foodMenuController.getMenuStatus(req, res);
});

// ============================================================
// === НОВЫЕ РОУТЫ (сбалансированные обеды) ===
// ============================================================

/**
 * GET /food-menu/meal-deal
 * Сбалансированный обед на сегодня
 * Query: ?date=01.09.26
 */
router.get('/meal-deal', (req, res) => {
  mealDealController.getBalancedMealDeal(req, res);
});

/**
 * GET /food-menu/meal-deal/random
 * Случайный обед (рефетч)
 * Query: ?date=01.09.26
 */
router.get('/meal-deal/random', (req, res) => {
  mealDealController.getRandomMealDeal(req, res);
});

/**
 * GET /food-menu/meal-deal/economy
 * Эконом обед (самые дешевые блюда)
 * Query: ?date=01.09.26
 */
router.get('/meal-deal/economy', (req, res) => {
  mealDealController.getEconomyMealDeal(req, res);
});

/**
 * GET /food-menu/meal-deal/hearty
 * Сытный обед (самые большие порции)
 * Query: ?date=01.09.26
 */
router.get('/meal-deal/hearty', (req, res) => {
  mealDealController.getHeartyMealDeal(req, res);
});

/**
 * GET /food-menu/meal-deal/veggie
 * Вегетарианский обед
 * Query: ?date=01.09.26
 */
router.get('/meal-deal/veggie', (req, res) => {
  mealDealController.getVeggieMealDeal(req, res);
});

/**
 * GET /food-menu/meal-deal/fish
 * Рыбный обед
 * Query: ?date=01.09.26
 */
router.get('/meal-deal/fish', (req, res) => {
  mealDealController.getFishMealDeal(req, res);
});

export default router;
