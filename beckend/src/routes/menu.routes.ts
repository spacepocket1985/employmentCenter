import { Router } from 'express';
import multer from 'multer';
import { MenuController } from '../controllers/menu.controller';

const router = Router();

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только CSV файлы'));
    }
  }
});

// Получить всё меню
router.get('/', MenuController.getMenu);

// Получить статус меню
router.get('/status', MenuController.getMenuStatus);

// Загрузить новое меню
router.post('/upload', upload.single('csvFile'), MenuController.uploadMenu);

// Очистить меню
router.delete('/clear', MenuController.clearMenu);

export const menuRoutes = router;