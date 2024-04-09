import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const style = {
  position: 'absolute' as const,
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '4px solid #1976d2',
  boxShadow: 24,
  p: 4,
};

const styleCloseBtn = {
  position: 'absolute' as const,
  top: '-15px',
  right: '-15px',
};

type UIModalPropsType = {
  children: (handleClose: () => void) => React.ReactNode;
  iconType: 'edit' | 'account';
  iconColor: string;
};

export const UIModal = (props: UIModalPropsType): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderIcon = () => {
    switch (props.iconType) {
      case 'edit':
        return <EditIcon style={{ color: props.iconColor }} />;
      case 'account':
        return <AccountCircleIcon style={{ color: props.iconColor }} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <IconButton aria-label="edit" onClick={handleOpen}>
        {renderIcon()}
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Button
            aria-label="close"
            onClick={handleClose}
            variant="contained"
            size="small"
            sx={styleCloseBtn}
          >
            Закрыть
          </Button>
          {props.children(handleClose)}
        </Box>
      </Modal>
    </div>
  );
};
