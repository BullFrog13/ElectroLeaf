import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DetailsOutlinedIcon from '@material-ui/icons/DetailsOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { NanoleafClient } from 'nanoleaf-client';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
  },
  grid: {
    marginTop: -theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: theme.palette.button.redGradient,
  },
  grayText: {
    color: theme.palette.primary.light,
  },
  whiteText: {
    color: theme.palette.primary.contrastText,
  },
  ipTextField: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.default,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: theme.palette.primary.contrastText,
  },
  displayCenter: {
    textAlign: 'center',
  },
}));

export default function DeviceDetector() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({ open: false, host: '' });

  const goToDashboard = () => {
    // history.push({
    //   pathname: '/dashboard',
    //   // state: { state.host },
    // });
    history.push({
      pathname: '/dashboard',
      state: state.host,
    });
  };

  const toggleModal = () => {
    setState((prevState) => ({
      ...prevState,
      open: !prevState.open,
    }));
  };

  const submitIp = () => {
    toggleModal();
  };

  const authorize = async () => {
    const nanoleafClient = new NanoleafClient(state.host);
    // await nanoleafClient.authorize();

    try {
    } catch (e) {}

    console.log(nanoleafClient);

    goToDashboard();
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Grid container justify="center" className={classes.grid}>
        <Avatar className={classes.avatar}>
          <DetailsOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className={classes.whiteText}>
          Locate Device
        </Typography>
        <TextField
          id="filled-basic"
          label="Enter the Device IP"
          variant="filled"
          color="secondary"
          className={classes.ipTextField}
          InputLabelProps={{ className: classes.grayText }}
          InputProps={{ className: classes.whiteText }}
          value={state.host}
          onChange={(e) => {
            setState({ ...state, host: e.target.value });
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={submitIp}
          disabled={!state.host}
        >
          Continue
        </Button>
      </Grid>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={state.open}
        onClose={toggleModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={state.open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title" className={classes.displayCenter}>
              Authorization
            </h2>
            <p id="transition-modal-description">
              Hold on-off button down for 5-7 seconds until the LED starts
              flashing and click the button.
            </p>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={authorize}
              disabled={!state.host}
            >
              Authorize
            </Button>
          </div>
        </Fade>
      </Modal>
    </Container>
  );
}
