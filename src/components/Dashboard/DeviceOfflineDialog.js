import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import ErrorIcon from '@material-ui/icons/Error';
import { Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { DEFAULT_SNACKBAR_TIMEOUT } from '../../constants';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    backgroundColor: theme.palette.secondary.contrastText,
    color: theme.palette.common.white,
  },
  errorIcon: {
    float: 'right',
    color: theme.palette.error.main,
    fontSize: '1.6em',
  },
  tryButton: {
    background: theme.palette.button.redGradient,
  },
}));

export default function DeviceOfflineDialog({ open, closeDialog, nanoleafClient, ...other }) {
  const classes = useStyles();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const toggleAlert = () => {
    setAlertOpen(!alertOpen);
  };

  const tryConnect = () => {
    nanoleafClient.getInfo().then(() => {
      closeDialog();
    }, error => {
      if (error.status === 0) {
        toggleAlert();
      }
    });
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="confirmation-dialog-title"
      open={open}
      PaperProps={{ className: classes.dialogPaper }}
      {...other}
    >
      <DialogTitle>Device is offline<ErrorIcon className={classes.errorIcon} /></DialogTitle>
      <DialogContent>
        <Typography>Looks like your device is offline.</Typography>
        <Typography>Make sure Nanoleaf is plugged and connected to WiFi.</Typography>
      </DialogContent>
      <DialogActions>
        <Button className={classes.tryButton} onClick={tryConnect} variant="contained" color="primary">
          Connect
        </Button>
      </DialogActions>
      <Snackbar open={alertOpen} autoHideDuration={DEFAULT_SNACKBAR_TIMEOUT} onClose={toggleAlert}>
        <Alert onClose={toggleAlert} severity="warning">
          The device is still offline. Check your connection.
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
