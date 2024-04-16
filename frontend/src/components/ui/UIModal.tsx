import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const defaultTop = '30%';

const style = {
  position: 'absolute' as const,
  top: defaultTop,
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
  children: (handleClose?: () => void) => React.ReactNode;
  iconType?: 'edit' | 'account' | 'thumbUp';
  iconLabel?: string;
  top?: string;
  iconButtonStyle?: React.CSSProperties;
};

export const UIModal = (props: UIModalPropsType): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderIcon = () => {
    switch (props.iconType) {
      case 'edit':
        return <EditIcon />;
      case 'account':
        return <AccountCircleIcon />;
      case 'thumbUp':
        return <ThumbUpAltIcon />;
      default:
        return null;
    }
  };

  const customStyle = {
    ...style,
    top: props.top || defaultTop,
  };

  return (
    <div>
      <IconButton
        aria-label="edit"
        onClick={handleOpen}
        style={{ color: '#1976d2', ...props.iconButtonStyle }}
      >
        {renderIcon()}
        <Typography variant="subtitle1" component="span">
          {props.iconLabel}
        </Typography>
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <Box sx={customStyle}>
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
