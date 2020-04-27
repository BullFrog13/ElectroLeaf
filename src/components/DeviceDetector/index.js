import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { NanoleafClient } from 'nanoleaf-client';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import CustomStepper from './CustomStepper';
import StepTwo from './StepTwo';
import { updateConfig } from '../services/config-service';

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
  stepText: {
    color: 'white',
  },
  title: {
    color: 'white',
  },
}));


export default function DeviceDetector() {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = React.useState({
    isDiscoverRunning: false, devices: [], selectedDevice: {},
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());


  const handleNext = () => {
    const newSkipped = skipped;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
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
      selectedDevice: device,
    });
    handleNext();
  };

  const authorize = () => {
    const client = new NanoleafClient(new URL(state.selectedDevice.location).hostname);

    client.authorize().then(token => {
      state.selectedDevice.token = token;
      updateConfig(state.selectedDevice).then(() => {
        history.push({
          pathname: '/dashboard',
          state: state.selectedDevice,
        });
      });
    });
  };

  return (
    <Container component="main" className={classes.container}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <CustomStepper activeStep={state.activeStep} />
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
          <StepTwo handleSelectDevice={handleSelectDevice} devices={state.devices} />
        )}
        {activeStep === 2 && (
          <Grid item className={classes.grid} xs={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={authorize}
            >
              Authorize
            </Button>
            {
              state.isDiscoverRunning && <LinearProgress className={classes.loadingBar} variant="query" color="secondary" />
            }
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
