import MenuDisplay from '@components/menu/menuDisplay';
import { useMenuDisplay } from '@hooks/useMenuDisplay';

const App = (): JSX.Element => {
  const {
    menu,
    isLoading,
    error,
    formatPrice,
    isToday,
    handlePrint,
    clearError,
    refetchMenu,
  } = useMenuDisplay();
  return (
    <MenuDisplay
      menu={menu}
      isLoading={isLoading}
      isToday={isToday}
      error={error}
      formatPrice={formatPrice}
      handlePrint={handlePrint}
      clearError={clearError}
      refetchMenu={refetchMenu}
    />
  );
};

export default App;
