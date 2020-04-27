import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import DetailsIcon from '@material-ui/icons/Details';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  grayText: {
    color: theme.palette.primary.light,
  },
  whiteText: {
    color: theme.palette.primary.contrastText,
  },
}));

export default function StepTwo({ handleSelectDevice, devices }) {
  const classes = useStyles();

  return (
    <Grid item className={classes.grid} xs={4}>
      <Typography variant="h6" className={classes.whiteText}>
        Discovered Devices
      </Typography>
      <div className={classes.demo}>
        <List>
          {devices.map((device) => (
            <ListItem
              button
              onClick={() => handleSelectDevice(device)}
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
    </Grid>
  );
}
