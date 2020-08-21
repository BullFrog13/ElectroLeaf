import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CardContent, Slider, Chip } from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import CardWrapper from '../CardWrapper';

const useStyles = makeStyles((theme) => ({
  chip: {
    marginBottom: theme.spacing(8),
  },
  slider: {
    width: '96%',
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
        <CardContent>
          <Chip
            icon={<Brightness7Icon />}
            label="Brightness"
            color="secondary"
            className={classes.chip}
          />
          <Slider
            value={brightness}
            onChangeCommitted={updateDeviceBrightness}
            onChange={updateBrightnessValue}
            className={classes.slider}
            valueLabelDisplay="on"
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
      </div>
    )}
    />
  );
}
