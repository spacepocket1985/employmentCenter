import express from 'express';
import workPlanController from '../controllers/workPlan.controller';

const router = express.Router();

router.post('/', workPlanController.createPlan);
router.get('/', workPlanController.getAllPlans);
router.get('/:id', workPlanController.getPlan);
router.put('/:id', workPlanController.updatePlan);
router.delete('/:id', workPlanController.deletePlan);

export default router;