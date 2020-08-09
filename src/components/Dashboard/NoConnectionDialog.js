import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';


const useStyles = makeStyles((theme) => ({
  dialog: {
    backgroundColor: theme.palette.secondary.contrastText,
    color: theme.palette.common.white,
  },
}));

export default function NoConnectionDialog({ open, closeDialog, ...other }) {
  const classes = useStyles();

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="confirmation-dialog-title"
      open={open}
      className={classes.dialog}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Phone Ringtone</DialogTitle>
      <DialogContent dividers>
        <h1>hi</h1>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
