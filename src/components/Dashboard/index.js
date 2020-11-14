import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Container,
  Grid,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch } from '@material-ui/core';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import { useHistory } from 'react-router-dom';
import AppsIcon from '@material-ui/icons/Apps';
import { NanoleafClient } from 'nanoleaf-client';
import NanoleafLayout from 'nanoleaf-layout/lib/NanoleafLayout';
import convert from 'color-convert';
import Box from '@material-ui/core/Box';
import ThemeCard from './Cards/ThemeCard';
import BrightnessCard from './Cards/BrightnessCard';
import ColorTemperatureCard from './Cards/ColorTemperatureCard';
import ActiveModeCard from './Cards/ActiveModeCard';
import ColorCard from './Cards/ColorCard';
import CardDivider from './CardDivider';
import NoConnectionDialog from './NoConnectionDialog';
import theme from '../../theme';

const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  container: {
    padding: 0,
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
  });

  const stateRef = useRef({});
  stateRef.current = state;

  const updateLayoutSolidColor = (layout, hex) => {
    Array.from(layout.positionData).forEach((panel) => {
      panel.color = hex;
    });

    return layout;
  };

  const getAndUpdateState = (fromInterval) => {
    if (navigator.onLine) {
      const { nanoleafClient } = state;
      nanoleafClient.getInfo().then(deviceInfo => {
        if (deviceInfo.state) {
          if (deviceInfo.state.colorMode === 'hs') {
            deviceInfo.panelLayout.layout = updateLayoutSolidColor(deviceInfo.panelLayout.layout,
              `#${convert.hsv.hex([
                deviceInfo.state.hue.value,
                deviceInfo.state.sat.value,
                deviceInfo.state.brightness.value,
              ])}`);
          }

          if (fromInterval && deviceInfo.state.colorMode === 'effect') {
            deviceInfo.panelLayout.layout = stateRef.current.layout;
          }

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
    getAndUpdateState(false);

    const interval = setInterval(() => {
      getAndUpdateState(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state.colorMode === 'effect') {
      state.nanoleafClient.getEffectInfo(state.selectedEffect).then(response => {
        const { layout } = state;
        const panels = Array.from(layout.positionData);
        const palette = Array.from(response.palette);

        for (let i = 0, j = 0; i < panels.length; i++) {
          const hex = `#${convert.hsv.hex(palette[j].hue, palette[j].saturation, palette[j].brightness)}`;

          panels[i].color = hex;
          // increment to next color in pallete or start from beginning
          j = (j + 1) === palette.length ? 0 : j + 1;
        }

        setState({ ...state, layout });
      });
    }
  }, [state.colorMode, state.selectedEffect]);

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
    const layout = updateLayoutSolidColor(state.layout, color.hex);

    setState({ ...state, color: color.hex.substring(1), layout });
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

  const switchPower = (event) => {
    const { checked } = event.target;

    state.nanoleafClient.power(checked)
      .then(() => { updatePower(checked); });
  };

  const getConicGradientPalette = () => {
    let colorString = String();

    const panels = Array.from(stateRef.current.layout.positionData);

    panels.forEach(panel => {
      colorString += `${panel.color},`;
    });

    // finishing with starting color to create smooth transition
    colorString += panels[0].color;

    return `conic-gradient(${colorString})`;
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
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem button>
            <ListItemIcon>
              <AppsIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="General" />
          </ListItem>
          <CardDivider />
          <ListItem button>
            <ListItemIcon>
              <ChangeHistoryIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Devices" />
          </ListItem>
          <CardDivider />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={2}>
            <Grid className={classes.displayFlex} item xs={6} md={6} lg={6} style={{ justifyContent: 'center' }}>
              <Box display="flex" style={{ width: '100%', height: '100%', background: state.colorMode === 'effect' ? getConicGradientPalette() : `#${state.color}`, borderRadius: '10px', justifyContent: 'center' }}>
                <Box display="flex" style={{ width: '98%', height: '98%', marginTop: '1%', backgroundColor: theme.palette.primary.main, borderRadius: '10px', justifyContent: 'center' }}>
                  <NanoleafLayout data={state.layout} svgStyle={{ width: '75%', marginLeft: '4%', transform: `rotate(${state.rotation}deg)` }} />
                </Box>
              </Box>
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
    </div>
  );
}
