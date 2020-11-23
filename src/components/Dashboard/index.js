import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Container,
  Grid,
  Button } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { useHistory } from 'react-router-dom';
import { NanoleafClient } from 'nanoleaf-client';
import convert from 'color-convert';
import ThemeCard from './Cards/ThemeCard';
import BrightnessCard from './Cards/BrightnessCard';
import ColorTemperatureCard from './Cards/ColorTemperatureCard';
import ActiveModeCard from './Cards/ActiveModeCard';
import ColorCard from './Cards/ColorCard';
import NoConnectionDialog from './NoConnectionDialog';
import NanoleafLayoutCard from './Cards/NanoleafLayoutCard';
import DeviceOfflineDialog from './DeviceOfflineDialog';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  spaceBetweenContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  powerButtonIcon: {
    margin: 0,
  },
  powerButtonOn: {
    border: 0,
    boxShadow: 'inset 0 0 15px #fff, inset 5px 0 10px #f0f, inset -5px 0 10px #0ff, '
    + ' inset 5px 0 20px #f0f, inset -5px 0 20px #0ff, 0 0 50px #fff, -2px 0 10px #f0f, 2px 0 10px #0ff',
    '&:hover': {
      border: 0,
    },
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
    isPowerOn: false,
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
    effectsInfo: [],
    selectedEffect: '',
    colorMode: '',
    openConnectionDialog: false,
    deviceIsOffline: false,
  });

  const updateLayoutSolidColor = (layout, hex) => {
    layout.positionData.forEach((panel) => {
      panel.color = hex;
    });

    return layout;
  };

  const updatePanelsColorData = (layout, selectedEffect) => {
    for (let i = 0, j = 0; i < layout.positionData.length; i++) {
      const hex = `#${convert.hsv.hex(selectedEffect.palette[j].hue, selectedEffect.palette[j].saturation, selectedEffect.palette[j].brightness)}`;

      layout.positionData[i].color = hex;
      // increment to next color in pallete or start from beginning
      j = (j + 1) === selectedEffect.palette.length ? 0 : j + 1;
    }
  };

  const getAndUpdateState = () => {
    if (navigator.onLine) {
      const { nanoleafClient } = state;

      const getEffectsInfoPromise = nanoleafClient.getEffectsInfo();
      const getInfoPromise = nanoleafClient.getInfo();

      Promise.all([getEffectsInfoPromise, getInfoPromise]).then((response) => {
        const effectsInfo = response[0].animations;
        const deviceInfo = response[1];

        if (deviceInfo.state) {
          let selectedEffect = {};

          const { layout } = deviceInfo.panelLayout;

          if (deviceInfo.state.colorMode === 'effect') {
            selectedEffect = effectsInfo.find(animation => animation.animName === deviceInfo.effects.select);

            updatePanelsColorData(layout, selectedEffect);
          }

          // info
          if (deviceInfo.state.colorMode === 'hs') {
            deviceInfo.panelLayout.layout = updateLayoutSolidColor(deviceInfo.panelLayout.layout,
              `#${convert.hsv.hex([
                deviceInfo.state.hue.value,
                deviceInfo.state.sat.value,
                deviceInfo.state.brightness.value,
              ])}`);
          }

          setState({ ...state,
            brightness: deviceInfo.state.brightness.value,
            isPowerOn: deviceInfo.state.on.value,
            ctValue: deviceInfo.state.ct.value,
            layout: deviceInfo.panelLayout.layout,
            rotation: deviceInfo.panelLayout.globalOrientation.value,
            color: convert.hsv.hex([
              deviceInfo.state.hue.value,
              deviceInfo.state.sat.value,
              deviceInfo.state.brightness.value,
            ]),
            effectsInfo,
            selectedEffect,
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

  useEffect(() => {
    getAndUpdateState();

    const interval = setInterval(() => {
      getAndUpdateState();
    }, 5000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateDeviceBrightness = (_event, brightness) => {
    state.nanoleafClient.setBrightness(brightness);
  };

  const updatePower = power => {
    setState({ ...state, isPowerOn: power });
  };

  const updateBrightnessValue = (_event, brightness) => {
    setState({ ...state, brightness });
  };

  const updateDeviceCt = (_event, ctValue) => {
    state.nanoleafClient.setColorTemperature(ctValue)
      .then(() => { setState(prevState => ({ ...prevState, ctValue, colorMode: 'ct' })); });
  };

  const updateCtValue = (_event, ctValue) => {
    setState({ ...state, ctValue });
  };

  const updateDeviceColor = color => {
    state.nanoleafClient.setHexColor(color.hex)
      .then(() => { setState(prevState => ({ ...prevState, color: color.hex })); });
  };

  const updateColor = color => {
    const layout = updateLayoutSolidColor(state.layout, color.hex);

    setState({ ...state, color: color.hex.substring(1), layout, colorMode: 'hs' });
  };

  const selectEffect = (event) => {
    const { value } = event.target;

    state.nanoleafClient.setEffect(value.animName)
      .then(() => {
        updatePanelsColorData(state.layout, value);
        setState({ ...state, selectedEffect: value, colorMode: 'effect', layout: state.layout });
      });
  };

  const closeConnectionDialog = () => {
    setState({ ...state, openConnectionDialog: false });
  };

  const closeDeviceOfflineDialog = () => {
    setState({ ...state, deviceIsOffline: false });
  };

  const switchPowerButton = () => {
    state.nanoleafClient.power(!state.isPowerOn)
      .then(() => { updatePower(!state.isPowerOn); });
  };

  return (
    <div className={classes.displayFlex}>
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar className={classes.spaceBetweenContent}>
          <Button
            variant="outlined"
            color="secondary"
            classes={{ endIcon: classes.powerButtonIcon }}
            className={state.isPowerOn ? classes.powerButtonOn : ''}
            onClick={switchPowerButton}
            endIcon={<PowerSettingsNewIcon />}
          />

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              history.push('/', { isForceStayOnDetector: true });
            }}
          >
            Device Discovery
          </Button>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container}>
          <Grid container spacing={2}>
            <Grid className={classes.displayFlex} item xs={6} md={6} lg={6} style={{ justifyContent: 'center' }}>
              <NanoleafLayoutCard
                colorMode={state.colorMode}
                color={state.color}
                layout={state.layout}
                rotation={state.rotation}
              />
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
                effectList={state.effectsInfo}
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
