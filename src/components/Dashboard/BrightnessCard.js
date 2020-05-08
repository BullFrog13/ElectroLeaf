import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader, Divider } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles(() => ({
  alignCenter: {
    alignItems: 'center',
    display: 'inline',
  },
}));

export default function BrightnessCard({
  brightness,
  updateDeviceBrightness,
  updateBrightnessValue }) {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        title="Brightness"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Slider
          value={brightness}
          onChangeCommitted={updateDeviceBrightness}
          onChange={updateBrightnessValue}
          aria-labelledby="continuous-slider"
          marks={[
            { value: 0, label: '0' },
            { value: 100, label: '100' },
          ]}
        />
      </CardContent>
      <Divider />
      <CardActions className={classes.alignCenter}>
        <Typography align="center" variant="h6" color="textSecondary">
          {brightness}
        </Typography>
      </CardActions>
    </Card>
  );
}
