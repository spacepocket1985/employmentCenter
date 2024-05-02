import { app, port } from './app';
import { startDB } from './utils/startDB';

const startApp = async (): Promise<void> => {
  await startDB();

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
};

startApp();
