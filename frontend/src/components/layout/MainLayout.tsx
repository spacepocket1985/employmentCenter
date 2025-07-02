import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export const MainLayout: React.FC = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);
