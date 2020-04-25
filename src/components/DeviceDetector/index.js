import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import DetailsOutlinedIcon from '@material-ui/icons/DetailsOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { NanoleafClient } from 'nanoleaf-client';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepTwo from './StepTwo';

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
  stepper: {
    backgroundColor: 'transparent',
  },
  loadingBar: {
    width: '100%',
  },
}));

export default function DeviceDetector() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = React.useState({
    isDiscoverRunning: false, devices: [], selectedDevice: {}
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const steps = ['Discover devices', 'Select device', 'Authorize device'];

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const discover = () => {
    setState({ ...state, isDiscoverRunning: true });
    axios.get('http://localhost:3001/discover').then((res) => {
      const devices = res.data.filter(
        (device, index, self) => index === self.findIndex((t) => t.uuid === device.uuid),
      );
      setState({
        ...state,
        devices,
        isDiscoverRunning: false,
      });
      handleNext();
    });
  };

  const handleSelectDevice = device => {
    setState({
      ...state,
      selectedDevice: device
    });
    handleNext();
  };

  const authorize = () => {
    let client = new NanoleafClient(new URL(state.selectedDevice.location).hostname);

    client.authorize().then(token => {
      state.selectedDevice.token = token;
      history.push({
        pathname: '/dashboard',
        state: state.selectedDevice
      });
    });
  };

  return (
    <Container component="main" className={classes.container}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                </Button>
                  {isStepOptional(activeStep) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSkip}
                      className={classes.button}
                    >
                      Skip
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              )}
          </div>
        </Grid>
        {activeStep === 0 && (
          <Grid item className={classes.grid} xs={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={discover}
            >
              Discover
            </Button>
            {
              state.isDiscoverRunning && <LinearProgress className={classes.loadingBar} variant="query" color="secondary" />
            }
          </Grid>
        )}
        {activeStep === 1 && (
          <StepTwo handleSelectDevice={handleSelectDevice} devices={state.devices} classes />
        )}
        {activeStep === 2 && (
          <Grid item className={classes.grid} xs={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={authorize}>
              Authorize
            </Button>
            {
              state.isDiscoverRunning && <LinearProgress className={classes.loadingBar} variant="query" color="secondary" />
            }
            {/* <Avatar className={classes.avatar}>
              <DetailsOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              className={classes.whiteText}
            >
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
              onClick={() => {
                console.log('submitting ip');
              }}
              disabled={!state.host}
            >
              Continue
            </Button> */}
          </Grid>
        )}
      </Grid>
      {/* <Modal
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
      </Modal> */}
    </Container>
  );
}
