import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LinearProgress from '@material-ui/core/LinearProgress';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DetailsIcon from '@material-ui/icons/Details';
import { green, red, grey } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';
import CardDivider from '../Dashboard/CardDivider';
import {
  UNPROCCESSABLE_ENTITY_HTTP_CODE,
  DEFAULT_REQUEST_TIMEOUT,
  DISCOVERY_SERVICE_URL,
  CONNECTION_ABORTED_HTTP_RESPONSE_CODE,
} from '../../constants';

const useStyles = makeStyles((theme) => ({
  grayText: {
    color: theme.palette.primary.light,
  },
  whiteText: {
    color: theme.palette.common.white,
  },
  title: {
    marginTop: theme.spacing(1),
    color: theme.palette.common.white,
  },
  discoverButton: {
    margin: theme.spacing(3, 0, 2),
    background: theme.palette.button.redGradient,
  },
  loadingBar: {
    width: '100%',
  },
  savedDeviceText: {
    color: theme.palette.common.white,
    display: 'inline',
  },
  savedDeviceHintText: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function StepTwo({
  selectDevice,
  useSavedDevice,
  savedDevice,
  isSavedDeviceConnecting,
  showCloseDevicesNotFoundError,
  removeSavedDevice }) {
  const classes = useStyles();

  const [state, setState] = useState({
    isDiscoveryRunning: false,
    discoveredDevices: [],
    noDevicesFound: false,
    savedDeviceActive: false,
  });

  useEffect(() => {
    if (savedDevice) {
      axios.get(savedDevice.location, { timeout: DEFAULT_REQUEST_TIMEOUT })
        .then(() => { }, error => {
          let deviceActive = false;

          if (error.response && error.response.status === UNPROCCESSABLE_ENTITY_HTTP_CODE) {
            deviceActive = true;
          }

          if (error.code === CONNECTION_ABORTED_HTTP_RESPONSE_CODE) {
            deviceActive = false;
          }

          setState({
            ...state,
            savedDeviceActive: deviceActive,
          });
        });
    }
  }, []);

  const discover = () => {
    setState({ ...state, isDiscoveryRunning: true });
    axios.get(`${DISCOVERY_SERVICE_URL}/discover`).then((res) => {
      if (res.data.length === 0) {
        setState({
          ...state,
          noDevicesFound: true,
          isDiscoveryRunning: false,
        });
      } else {
        let devices = res.data.filter(
          (device, index, self) => index === self.findIndex(t => t.uuid === device.uuid),
        );

        if (savedDevice) {
          devices = devices.filter(d => d.location !== savedDevice.location);
        }
        const noDevicesFound = devices.length === 0;

        if (noDevicesFound) {
          showCloseDevicesNotFoundError();
        }

        setState({
          ...state,
          discoveredDevices: devices,
          isDiscoveryRunning: false,
          noDevicesFound,
        });
      }
    });
  };

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

  return (
    <Grid item xs={8} sm={6} md={6} lg={4}>
      {savedDevice
      && (
      <div>
        <div className={classes.savedDeviceHintText}>
          <Typography variant="h6" className={classes.savedDeviceText}>
            Saved Device
          </Typography>
          <HtmlTooltip
            title={(
              <>
                <div className={classes.savedDeviceHintText}>
                  <DetailsIcon fontSize="large" style={{ color: green[500] }} />
                  <p>Device is connected.</p>
                </div>
                <div className={classes.savedDeviceHintText}>
                  <DetailsIcon fontSize="large" style={{ color: red[500] }} />
                  <p>Your device configuration has changed. Please rediscover it.</p>
                </div>
              </>
        )}
          >
            <IconButton aria-label="hint" size="medium">
              <HelpOutlineIcon fontSize="inherit" style={{ color: grey[400] }} />
            </IconButton>
          </HtmlTooltip>
        </div>
        <List>
          <ListItem
            button
            onClick={useSavedDevice}
          >
            <ListItemIcon>
              <DetailsIcon fontSize="large" style={{ color: state.savedDeviceActive ? green[500] : red[500] }} />
            </ListItemIcon>
            <ListItemText
              primary={savedDevice.deviceId}
              secondary={savedDevice.location}
              classes={{ primary: classes.whiteText, secondary: classes.grayText }}
            />
            {
              isSavedDeviceConnecting
            && <CircularProgress color="secondary" />
            }
            <IconButton aria-label="Remove saved device" onClick={removeSavedDevice}>
              <CloseIcon fontSize="large" style={{ color: grey[100] }} />
            </IconButton>
          </ListItem>
        </List>
      </div>
      )}
      {!(state.discoveredDevices && state.discoveredDevices.length > 0)
        && !state.isDiscoveryRunning && (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.discoverButton}
          onClick={discover}
        >
          { state.noDevicesFound ? 'Retry Discovery' : 'Discover New Devices'}
        </Button>
      )}
      {
        state.isDiscoveryRunning
          && <LinearProgress className={classes.loadingBar} variant="query" color="secondary" />
      }
      {(state.discoveredDevices && state.discoveredDevices.length > 0) && (
        <div>
          {savedDevice && <CardDivider />}
          <Typography variant="h6" className={classes.title}>
            Discovered Devices
          </Typography>
          <List>
            {state.discoveredDevices.map((device) => (
              <ListItem
                button
                onClick={() => selectDevice(device)}
                key={device.deviceId}
              >
                <ListItemIcon>
                  <DetailsIcon fontSize="large" style={{ color: green[500] }} />
                </ListItemIcon>
                <ListItemText
                  primary={device.deviceId}
                  secondary={device.location}
                  classes={{ primary: classes.whiteText, secondary: classes.grayText }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Grid>
  );
}
