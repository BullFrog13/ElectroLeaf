import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import DetailsIcon from '@material-ui/icons/Details';
import { green } from '@material-ui/core/colors';
import axios from 'axios';
import CardDivider from '../Dashboard/CardDivider';

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
}));

export default function StepTwo({ selectDevice, useSavedDevice, savedDevice }) {
  const classes = useStyles();

  const [state, setState] = useState({
    isDiscoveryRunning: false,
    discoveredDevices: [],
    noDevicesFound: false,
  });

  const discover = () => {
    setState({ ...state, isDiscoveryRunning: true });
    axios.get('http://localhost:3001/discover').then((res) => {
      if (res.data.length === 0) {
        setState({
          ...state,
          noDevicesFound: true,
          isDiscoveryRunning: false });
      } else {
        const devices = res.data.filter(
          (device, index, self) => index === self.findIndex(t => t.uuid === device.uuid),
        );

        setState({
          ...state,
          discoveredDevices: devices,
          isDiscoveryRunning: false,
          noDevicesFound: false,
        });
      }
    });
  };

  return (
    <Grid item xs={4}>
      {savedDevice
      && (
      <div>
        <Typography variant="h6" className={classes.whiteText}>
          Saved Device
        </Typography>
        <List>
          <ListItem
            button
            onClick={useSavedDevice}
          >
            <ListItemIcon>
              <DetailsIcon fontSize="large" style={{ color: green[500] }} />
            </ListItemIcon>
            <ListItemText
              primary={savedDevice.deviceId}
              secondary={savedDevice.location}
              classes={{ primary: classes.whiteText, secondary: classes.grayText }}
            />
          </ListItem>
        </List>
      </div>
      )}
      {!(state.discoveredDevices && state.discoveredDevices.length > 0) && !state.isDiscoveryRunning && (
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
      {
        state.noDevicesFound
          && <Typography className={classes.title}>No new devices were found</Typography>
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
