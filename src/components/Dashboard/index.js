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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader, Divider } from '@material-ui/core';
import { ChromePicker } from 'react-color';
import { NanoleafClient } from 'nanoleaf-client';
import NanoleafLayout from 'nanoleaf-layout/lib/NanoleafLayout';
import convert from 'color-convert';
import ThemeCard from './ThemeCard';
import BrightnessCard from './BrightnessCard';
import ColorTemperatureCard from './ColorTemperatureCard';

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
    checkedA: true,
    brightness: 30,
    ctValue: 1200,
    tabValue: 0,
    nanoleafClient: new NanoleafClient(new URL(location).hostname, token),
    layout: {
      numPanels: 0,
      sideLength: 0,
      positionData: [],
    },
    color: '',
    effectList: [],
    selectedEffect: '',
  });

  useEffect(() => {
    const getInfoPromise = state.nanoleafClient.getInfo();
    const getEffectListPromise = state.nanoleafClient.getEffectList();
    const getEffectPromise = state.nanoleafClient.getEffect();
    Promise.all([getInfoPromise, getEffectListPromise, getEffectPromise]).then(responses => {
      const deviceInfo = responses[0];
      const effectList = responses[1];
      const effect = responses[2];

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
          effectList: effectList,
          selectedEffect: (effect === '*Solid*') ? '' : effect,
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
          <ListItem button>
            <ListItemIcon>
              <ChangeHistoryIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Devices" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Card>
                <NanoleafLayout data={state.layout} svgStyle={{ height: '400px' }} />
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Card>
                <CardContent className={classes.colorCard}>
                  <ChromePicker
                    disableAlpha
                    onChange={updateColor}
                    onChangeComplete={updateDeviceColor}
                    color={state.color}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} lg={3}>
              <BrightnessCard brightness={state.brightness} updateDeviceBrightness={updateDeviceBrightness} updateBrightnessValue={updateBrightnessValue}/>
              </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <ColorTemperatureCard ctValue={state.ctValue} updateDeviceCt={updateDeviceCt} updateCtValue={updateCtValue}/>
              </Grid>
            <Grid item xs={12} md={3} lg={3}>
                      {
              <ThemeCard selectedEffect={state.selectedEffect} effectList={state.effectList} selectEffect={selectEffect} />
              </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Card>
                <CardHeader
                  title="Status"
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Word of the Day
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions className={classes.alignCenter}>
                  <Typography align="center" variant="h6" color="textSecondary">
                    OK
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
