import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Fade, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const Alert = (props) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Fade in={open}>
      <MuiAlert
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
              props.onClose(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        elevation={6}
        variant="filled"
        {...props}
      />
    </Fade>
  );
};

export default Alert;
