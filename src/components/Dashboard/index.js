import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer,
  Chip,
  AppBar,
  Toolbar,
  List,
  Typography,
  Container,
  Grid,
  ListItem,
  ListItemText,
  ListItemIcon,
  CardContent } from '@material-ui/core';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import { useHistory } from 'react-router-dom';
import AppsIcon from '@material-ui/icons/Apps';
import { ChromePicker } from 'react-color';
import { NanoleafClient } from 'nanoleaf-client';
import NanoleafLayout from 'nanoleaf-layout/lib/NanoleafLayout';
import convert from 'color-convert';
import ThemeCard from './ThemeCard';
import BrightnessCard from './BrightnessCard';
import ColorTemperatureCard from './ColorTemperatureCard';
import CardWrapper from './CardWrapper';
import CardDivider from './CardDivider';
import ActiveModeCard from './ActiveModeCard';


const drawerWidth = 160;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
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
  colorCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: theme.mixins.toolbar,
  chip: {
    marginBottom: theme.spacing(4),
  },
  colorChip: {
    width: 'fit-content',
    marginBottom: theme.spacing(4),
  },
}));

const colorPickerStyles = {
  background: 'none',
  boxShadow: 'none',
  margin: '0 -16px',
  width: 'auto',
};

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();

  const query = new URLSearchParams(history.location.search);
  const token = query.get('token');
  const location = query.get('location');

  if (!(token && location)) history.push('');

  const [state, setState] = useState({
    brightness: 30,
    ctValue: 1200,
    nanoleafClient: new NanoleafClient(new URL(location).hostname, token),
    layout: {
      numPanels: 0,
      sideLength: 0,
      positionData: [],
    },
    color: '',
    effectList: [],
    selectedEffect: '',
    colorMode: '',
  });

  const getAndUpdateState = () => {
    const { nanoleafClient } = state;
    const getInfoPromise = nanoleafClient.getInfo();
    const getEffectListPromise = nanoleafClient.getEffectList();
    const getEffectPromise = nanoleafClient.getEffect();
    const getColorMode = nanoleafClient.getColorMode();

    Promise.all([getInfoPromise, getEffectListPromise, getEffectPromise, getColorMode])
      .then(responses => {
        const deviceInfo = responses[0];
        const effectList = responses[1];
        const effect = responses[2];
        const colorMode = responses[3];

        if (deviceInfo.state) {
          setState({
            ...state,
            brightness: deviceInfo.state.brightness.value,
            ctValue: (deviceInfo.state.ct.value - 1200) / 53,
            layout: deviceInfo.panelLayout.layout,
            color: convert.hsv.hex([
              deviceInfo.state.hue.value,
              deviceInfo.state.sat.value,
              deviceInfo.state.brightness.value,
            ]),
            effectList,
            selectedEffect: (effect === '*Solid*') ? '' : effect,
            colorMode,
          });
        }
      });
  };

  const updateColorMode = () => {
    const { nanoleafClient } = state;

    nanoleafClient.getColorMode().then(colorMode => {
      setState({ ...state, colorMode });
    });
  };

  useEffect(() => {
    getAndUpdateState();
    const interval = setInterval(() => {
      getAndUpdateState();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateDeviceBrightness = (_event, brightness) => {
    state.nanoleafClient.setBrightness(brightness)
      .then(() => { updateColorMode(); });
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
    setState({ ...state, color });
  };

  const selectEffect = (event) => {
    const { value } = event.target;
    state.nanoleafClient.setEffect(value)
      .then(() => { updateColorMode(); });
    setState({ ...state, selectedEffect: value });
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classes.appBar}
        onClick={() => {
          history.push('/', { isForceDetectNew: true });
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            ElectroLeaf
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
            <Grid item xs={6} md={6} lg={6}>
              <NanoleafLayout data={state.layout} svgStyle={{ height: '60vh', maxHeight: '400px', margin: '-15px 0' }} />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
              <CardWrapper wrappedComponent={(
                <CardContent className={classes.colorCard}>
                  <Chip
                    icon={<ColorLensIcon />}
                    label="Color"
                    color="secondary"
                    className={classes.colorChip}
                  />
                  <ChromePicker
                    disableAlpha
                    onChange={updateColor}
                    onChangeComplete={updateDeviceColor}
                    color={state.color}
                    styles={{ default: { picker: colorPickerStyles } }}
                  />
                </CardContent>
                )}
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
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <ThemeCard
                selectedEffect={state.selectedEffect}
                effectList={state.effectList}
                selectEffect={selectEffect}
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
    </div>
  );
}
