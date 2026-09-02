// index.ts
import { app, port } from './app';
import { connectDB } from './config/db.config';
import { startMenuSyncJobs } from './jobs/syncMenu.job';


const startApp = async (): Promise<void> => {
  try {
    // Подключаемся к MongoDB
    await connectDB();

    // Запускаем сервер
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });

    // Запускаем планировщики синхронизации меню с 1С
    startMenuSyncJobs();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startApp();