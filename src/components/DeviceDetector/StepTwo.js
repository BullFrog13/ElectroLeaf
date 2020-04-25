import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';

export default function StepTwo({ handleSelectDevice, devices, classes }) {
  return (
    <Grid item className={classes.grid} xs={4}>
      <Typography variant="h6" className={classes.title}>
        Discovered Devices
      </Typography>
      <div className={classes.demo}>
        <List>
          {devices.map((device) => (
            <ListItem
              button
              onClick={() => handleSelectDevice(device)}
              key={device.deviceId}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary={device.deviceId}
                secondary={device.location}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Grid >
  );
}