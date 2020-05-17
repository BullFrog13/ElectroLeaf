import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import CardWrapper from './CardWrapper';
import CardDivider from './CardDivider';


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
    <CardWrapper wrappedComponent={(
      <div>
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
              { value: 20, label: '20' },
              { value: 40, label: '40' },
              { value: 60, label: '60' },
              { value: 80, label: '80' },
              { value: 100, label: '100' },
            ]}
            color="secondary"
          />
        </CardContent>
        <CardDivider />
        <CardActions className={classes.alignCenter}>
          <Typography align="center" variant="subtitle1">
            {brightness}
          </Typography>
        </CardActions>
      </div>
    )}
    />
  );
}
