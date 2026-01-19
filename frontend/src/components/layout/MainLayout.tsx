import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { Box } from '@mui/material';

export const MainLayout: React.FC = () => (
  // minHeight: '100vh' гарантирует, что layout всегда занимает минимум всю высоту окна
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <Header />

    {/* Основной контент с flexGrow: 1 занимает все доступное пространство */}
    {/* Это гарантирует, что футер будет всегда внизу, даже если контента мало */}
    {/* paddingBottom добавляет отступ снизу, чтобы контент не заходил под футер */}
    <Box
      component="main"
      sx={{
        flexGrow: 1, // Занимает все оставшееся пространство
        width: '100%',
        py: 3,
        px: 2,
      }}
    >
      <Outlet />
    </Box>

    <Footer />
  </Box>
);
