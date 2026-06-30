import express from 'express';
import { routeMapsController } from '../controllers/routeMaps.controller';

const router = express.Router();

router.get('/', routeMapsController.getAvailableMaps);
router.post('/reload', routeMapsController.reloadMaps); // Опционально: для принудительной перезагрузки

export default router;