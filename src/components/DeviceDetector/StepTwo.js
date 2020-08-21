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
import CardDivider from '../Dashboard/CardDivider';

const useStyles = makeStyles((theme) => ({
  grayText: {
    color: theme.palette.primary.light,
  },
  whiteText: {
    color: theme.palette.primary.contrastText,
  },
  discoverButton: {
    margin: theme.spacing(3, 0, 2),
    background: theme.palette.button.redGradient,
  },
  loadingBar: {
    width: '100%',
  },
}));

export default function StepTwo({ selectDevice, useSavedDevice, discoveredDevices, savedDevice, discover }) {
  const classes = useStyles();

  const [discoverRunning, setDiscoverRunning] = useState(false);
  const startDiscovery = () => {
    setDiscoverRunning(true);
    discover();
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
        {(discoveredDevices && discoveredDevices.length > 0) || (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.discoverButton}
          onClick={startDiscovery}
        >
          Discover Devices
        </Button>
        )}
      </div>
      )}
      {
        (discoverRunning && !(discoveredDevices && discoveredDevices.length > 0))
          && <LinearProgress className={classes.loadingBar} variant="query" color="secondary" />
      }
      {(!savedDevice || (discoveredDevices && discoveredDevices.length > 0)) && (
        <div>
          {savedDevice && <CardDivider />}
          <Typography variant="h6" className={classes.whiteText}>
            Discovered Devices
          </Typography>
          <List>
            {discoveredDevices.map((device) => (
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
