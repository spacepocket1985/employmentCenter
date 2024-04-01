import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

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
  children: (handleClose: () => void) => React.ReactNode
}

export const UIModal = (props: UIModalPropsType): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton aria-label="edit" onClick={handleOpen}>
        <EditIcon style={{ color: '#1976d2' }}/>
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
