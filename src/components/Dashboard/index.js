import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import { useHistory } from 'react-router-dom';
import AppsIcon from '@material-ui/icons/Apps';
import CardContent from '@material-ui/core/CardContent';
import { ChromePicker } from 'react-color';
import { NanoleafClient } from 'nanoleaf-client';
import NanoleafLayout from 'nanoleaf-layout/lib/NanoleafLayout';
import convert from 'color-convert';
import ModeCard from './ModeCard';
import BrightnessCard from './BrightnessCard';
import ColorTemperatureCard from './ColorTemperatureCard';
import StatusCard from './StatusCard';
import CardWrapper from './CardWrapper';
import CardDivider from './CardDivider';

const drawerWidth = 240;

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
  media: {
    height: 240,
  },
  colorCard: {
    height: 300,
  },
  toolbar: theme.mixins.toolbar,
  alignCenter: {
    alignItems: 'center',
    display: 'inline',
  },
}));

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

  useEffect(() => {
    const { nanoleafClient } = state;
    const getInfoPromise = nanoleafClient.getInfo();
    const getEffectListPromise = nanoleafClient.getEffectList();
    const getEffectPromise = nanoleafClient.getEffect();
    const getColorMode = nanoleafClient.getColorMode();

    Promise.all([getInfoPromise, getEffectListPromise, getEffectPromise, getColorMode]).then(responses => {
      const deviceInfo = responses[0];
      const effectList = responses[1];
      const effect = responses[2];
      const colorMode = responses[3];

      if (deviceInfo.state) {
        setState({
          ...state,
          brightness: deviceInfo.state.brightness.value,
          ctValue: deviceInfo.state.ct.value,
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
  }, []);

  const updateDeviceBrightness = (_event, brightness) => {
    state.nanoleafClient.setBrightness(brightness);
  };

  const updateBrightnessValue = (_event, brightness) => {
    setState({ ...state, brightness });
  };

  const updateDeviceCt = (_event, ctValue) => {
    state.nanoleafClient.setColorTemperature(ctValue);
  };

  const updateCtValue = (_event, ctValue) => {
    setState({ ...state, ctValue });
  };

  const updateDeviceColor = color => {
    state.nanoleafClient.setHexColor(color.hex);
  };

  const updateColor = color => {
    setState({ ...state, color });
  };

  const selectEffect = (event) => {
    const { value } = event.target;
    state.nanoleafClient.setEffect(value);
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <CardWrapper wrappedComponent={<NanoleafLayout data={state.layout} svgStyle={{ height: '400px' }} />} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <CardWrapper wrappedComponent={(
                <CardContent className={classes.colorCard}>
                  <ChromePicker
                    disableAlpha
                    onChange={updateColor}
                    onChangeComplete={updateDeviceColor}
                    color={state.color}
                  />
                </CardContent>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} lg={3}>
              <BrightnessCard
                brightness={state.brightness}
                updateDeviceBrightness={updateDeviceBrightness}
                updateBrightnessValue={updateBrightnessValue}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <ColorTemperatureCard
                ctValue={state.ctValue}
                updateDeviceCt={updateDeviceCt}
                updateCtValue={updateCtValue}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <ModeCard
                selectedEffect={state.selectedEffect}
                effectList={state.effectList}
                selectEffect={selectEffect}
                colorMode={state.colorMode}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <StatusCard />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
