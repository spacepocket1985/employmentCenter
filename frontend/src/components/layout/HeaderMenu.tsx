export const tec2Url = 'http://tec23.grodno.energo.net/';

import React from 'react';
import { RoleBasedControls } from '@components/auth';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';



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

        {user && <RoleBasedControls userName={user} renderAs="icons" />}
      </>
    );
  }
);
