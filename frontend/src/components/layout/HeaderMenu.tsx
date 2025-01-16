import React from 'react';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../../routes/routePaths';

export const tec2Url = 'http://tec23.grodno.energo.net/';

export const HeaderMenu: React.FC<{ user: string | null }> = React.memo(
  ({ user }) => {
    const IconButtonStyle = {
      borderRadius: '10px',
      backgroundColor: '#fff',
      marginRight: '5px',
    };

    const handleHomeClick = () => {
      window.location.href = tec2Url;
    };

    return (
      <>
        <IconButton onClick={handleHomeClick} style={IconButtonStyle}>
          <HomeIcon color="primary" />
        </IconButton>
        {user && (
          <>
            <IconButton
              component={Link}
              to={RoutePaths.EMPLOYEES}
              style={IconButtonStyle}
            >
              <CakeIcon color="primary" />
            </IconButton>
            <IconButton
              component={Link}
              to={RoutePaths.HOME}
              style={IconButtonStyle}
            >
              <WorkIcon color="primary" />
            </IconButton>
          </>
        )}
      </>
    );
  }
);
