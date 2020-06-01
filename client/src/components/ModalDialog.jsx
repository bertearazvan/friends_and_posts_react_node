import React, { useEffect } from 'react';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  Button,
} from '@material-ui/core/';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    props.onClose(false);
  };

  useEffect(() => {
    setOpen(props.open);
    return;
  }, [props.open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to proceed?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            In order for us to process the data correctly, we want to make sure
            that your action was not a mistake.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary">
            Go back
          </Button>
          <Button
            onClick={() => {
              props.deleteAction();
              handleClose();
            }}
            variant="outlined"
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
