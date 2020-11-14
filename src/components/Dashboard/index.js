import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Switch } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { NanoleafClient } from 'nanoleaf-client';
import NanoleafLayout from 'nanoleaf-layout/lib/NanoleafLayout';
import convert from 'color-convert';
import ThemeCard from './Cards/ThemeCard';
import BrightnessCard from './Cards/BrightnessCard';
import ColorTemperatureCard from './Cards/ColorTemperatureCard';
import ActiveModeCard from './Cards/ActiveModeCard';
import ColorCard from './Cards/ColorCard';
import NoConnectionDialog from './NoConnectionDialog';
import DeviceOfflineDialog from './DeviceOfflineDialog';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  container: {
    padding: 0,
    maxWidth: 'none',
  },
  toolbar: theme.mixins.toolbar,
  displayFlex: {
    display: 'flex',
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();

  const query = new URLSearchParams(history.location.search);
  const token = query.get('token');
  const location = query.get('location');
  // const deviceId = query.get('deviceId'); We're sending but not using it at the moment

  if (!(token && location)) history.push('');

  const [state, setState] = useState({
    power: false,
    brightness: 30,
    ctValue: 1200,
    nanoleafClient: new NanoleafClient(new URL(location).hostname, token),
    layout: {
      numPanels: 0,
      sideLength: 0,
      positionData: [],
    },
    rotation: 0,
    color: '',
    effectList: [],
    selectedEffect: '',
    colorMode: '',
    openConnectionDialog: false,
    deviceIsOffline: false,
  });

  const getAndUpdateState = () => {
    if (navigator.onLine) {
      const { nanoleafClient } = state;
      nanoleafClient.getInfo().then(deviceInfo => {
        if (deviceInfo.state) {
          setState({ ...state,
            brightness: deviceInfo.state.brightness.value,
            power: deviceInfo.state.on.value,
            ctValue: (deviceInfo.state.ct.value - 1200) / 53,
            layout: deviceInfo.panelLayout.layout,
            rotation: deviceInfo.panelLayout.globalOrientation.value,
            color: convert.hsv.hex([
              deviceInfo.state.hue.value,
              deviceInfo.state.sat.value,
              deviceInfo.state.brightness.value,
            ]),
            effectList: deviceInfo.effects.effectsList,
            selectedEffect: (deviceInfo.effects.select === '*Solid*') ? '' : deviceInfo.effects.select,
            colorMode: deviceInfo.state.colorMode,
          });
        }
      }, error => {
        if (error.status === 0) {
          setState({ ...state, deviceIsOffline: true });
        }
      });
    } else if (!state.openConnectionDialog) {
      setState({ ...state, openConnectionDialog: true });
    }
  };

  const updateColorMode = () => {
    const { nanoleafClient } = state;

    nanoleafClient.getInfo().then(deviceInfo => {
      const { colorMode, brightness } = deviceInfo.state;
      setState(prevState => ({ ...prevState, colorMode, brightness: brightness.value }));
    });
  };

  useEffect(() => {
    getAndUpdateState();
    const interval = setInterval(() => {
      getAndUpdateState();
    }, 5000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateDeviceBrightness = (_event, brightness) => {
    state.nanoleafClient.setBrightness(brightness)
      .then(() => { updateColorMode(); });
  };

  const updatePower = power => {
    setState({ ...state, power });
  };

  const updateBrightnessValue = (_event, brightness) => {
    setState({ ...state, brightness });
  };

  const updateDeviceCt = (_event, ctValue) => {
    state.nanoleafClient.setColorTemperature((ctValue * 53) + 1200)
      .then(() => { updateColorMode(); });
  };

  const updateCtValue = (_event, ctValue) => {
    setState({ ...state, ctValue });
  };

  const updateDeviceColor = color => {
    state.nanoleafClient.setHexColor(color.hex)
      .then(() => { updateColorMode(); });
  };

  const updateColor = color => {
    setState({ ...state, color: color.hex.substring(1) });
  };

  const selectEffect = (event) => {
    const { value } = event.target;
    state.nanoleafClient.setEffect(value)
      .then(() => { updateColorMode({ selectedEffect: value }); });
    setState({ ...state, selectedEffect: value });
  };

  const closeConnectionDialog = () => {
    setState({ ...state, openConnectionDialog: false });
  };

  const closeDeviceOfflineDialog = () => {
    setState({ ...state, deviceIsOffline: false });
  };

  const switchPower = (event) => {
    const { checked } = event.target;

    state.nanoleafClient.power(checked)
      .then(() => { updatePower(checked); });
  };

  return (
    <div className={classes.displayFlex}>
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            ElectroLeaf
            <Switch checked={state.power} inputProps={{ 'aria-label': 'secondary checkbox' }} onChange={switchPower} />
          </Typography>

          <Typography
            variant="h6"
            noWrap
            onClick={() => {
              history.push('/', { isForceStayOnDetector: true });
            }}
          >
            To Device Discovery
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container}>
          <Grid container spacing={2}>
            <Grid className={classes.displayFlex} item xs={6} md={6} lg={6}>
              <NanoleafLayout data={state.layout} svgStyle={{ width: '100%', margin: '-15px 0', transform: `rotate(${state.rotation}deg)` }} />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <ColorCard
                color={state.color}
                updateDeviceColor={updateDeviceColor}
                updateColor={updateColor}
                isModeEnabled={state.colorMode === 'hs'}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <BrightnessCard
                brightness={state.brightness}
                updateDeviceBrightness={updateDeviceBrightness}
                updateBrightnessValue={updateBrightnessValue}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <ColorTemperatureCard
                ctValue={state.ctValue}
                updateDeviceCt={updateDeviceCt}
                updateCtValue={updateCtValue}
                isModeEnabled={state.colorMode === 'ct'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <ThemeCard
                selectedEffect={state.selectedEffect}
                effectList={state.effectList}
                selectEffect={selectEffect}
                isModeEnabled={state.colorMode === 'effect'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <ActiveModeCard
                colorMode={state.colorMode}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3} />
          </Grid>
        </Container>
      </main>
      <NoConnectionDialog
        open={state.openConnectionDialog}
        closeDialog={closeConnectionDialog}
        maxWidth="sm"
        fullWidth
        keepMounted
      />
      <DeviceOfflineDialog
        open={state.deviceIsOffline}
        closeDialog={closeDeviceOfflineDialog}
        nanoleafClient={state.nanoleafClient}
        maxWidth="sm"
        fullWidth
        keepMounted
      />
    </div>
  );
}
