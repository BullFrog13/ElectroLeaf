import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { NanoleafClient } from 'nanoleaf-client';
import { Typography } from '@material-ui/core';
import CustomStepper from './CustomStepper';
import StepTwo from './StepTwo';
import { updateConfig, getConfig } from '../../services/config-service';

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
  redText: {
    color: theme.palette.error.main,
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
  title: {
    color: 'white',
  },
}));

export default function DeviceDetector() {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState({
    selectedDevice: {},
    activeStep: 0,
    savedDeviceConfig: null,
    authorizationFailed: false,
    isForceStayOnThisScreen: (history.location.state)
      ? history.location.state.isForceStayOnDetector : false,
  });

  const goToDashboard = (location, token, uuid) => {
    history.push({
      pathname: '/dashboard',
      search: `?location=${location}&token=${token}&uuid=${uuid}`,
    });
  };

  const tryUseSavedConfig = () => {
    getConfig().then((config) => {
      if (!state.isForceStayOnThisScreen && config) {
        goToDashboard(config.location, config.token, config.deviceId);
      } else if (config) {
        setState({ ...state, savedDeviceConfig: config });
      }
    });
  };

  useEffect(() => {
    tryUseSavedConfig();
  }, []);

  const goToDiscoveryStep = () => {
    setState({
      ...state,
      activeStep: state.activeStep + 1,
    });
  };

  const selectDevice = device => {
    setState({
      ...state,
      selectedDevice: device,
      activeStep: state.activeStep + 1,
    });
  };

  const useSavedDevice = () => {
    const { location, deviceId, token } = state.savedDeviceConfig;
    goToDashboard(location, token, deviceId);
  };

  const authorize = () => {
    const client = new NanoleafClient(new URL(state.selectedDevice.location).hostname);

    client.authorize().then(token => {
      updateConfig({ ...state.selectedDevice, token }).then(() => {
        goToDashboard(state.selectedDevice.location, token, state.selectedDevice.deviceId);
      });
    }, () => {
      setState({
        ...state,
        authorizationFailed: true,
      });
    });
  };

  return (
    <Container component="main" className={classes.container}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <CustomStepper activeStep={state.activeStep} />
        </Grid>
        {state.activeStep === 0 && (
          <Grid item className={classes.grid} xs={4}>
            {
              state.noDevicesFoundFlag && (
              <Typography className={classes.title}>Device not found</Typography>
              )
            }
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={goToDiscoveryStep}
            >
              Select Device
            </Button>
          </Grid>
        )}
        {state.activeStep === 1 && (
          <StepTwo
            selectDevice={selectDevice}
            savedDevice={state.savedDeviceConfig}
            useSavedDevice={useSavedDevice}
          />
        )}
        {state.activeStep === 2 && (
          <Grid item className={classes.grid} xs={4}>
            <Typography className={classes.whiteText}>
              Hold the on/off button for 5-7 seconds until the white LED starts flashing in a pattern, then authorize.
            </Typography>
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
            { state.authorizationFailed && (
            <Typography className={classes.redText}>
              Authorization failed. Make sure the white LED is blinking.
            </Typography>
            )}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
