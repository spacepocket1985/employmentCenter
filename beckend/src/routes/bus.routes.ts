import express from 'express';
import { busRouteController } from '../controllers/busRoute.controller';

const router = express.Router();

router.post('/', busRouteController.createBusRoute);
router.get('/', busRouteController.getAllBusRoutes);
router.get('/:id', busRouteController.getBusRoute);
router.put('/:id', busRouteController.updateBusRoute);
router.delete('/:id', busRouteController.deleteBusRoute);

export default router;
