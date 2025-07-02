import { useAppSelector } from '@hooks/storeHooks';
import { Box } from '@mui/material';

import { UserAuth, UserControls } from '@components/auth';

const AboutPage = (): JSX.Element => {
  const { name } = useAppSelector((state) => state.user);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {name ? <UserControls /> : <UserAuth />}
    </Box>
  );
};

export default AboutPage;
