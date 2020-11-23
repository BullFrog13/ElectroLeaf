import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CardContent, Chip, Slider } from '@material-ui/core';
import OpacityIcon from '@material-ui/icons/Opacity';
import classNames from 'classnames';
import CardWrapper from '../CardWrapper';

const useStyles = makeStyles((theme) => ({
  chip: {
    marginBottom: theme.spacing(8),
  },
  slider: {
    width: '96%',
  },
  greyBg: {
    background: theme.palette.neutral.main,
  },
}));

export default function ColorTemperatureCard({
  ctValue,
  updateDeviceCt,
  updateCtValue,
  isModeEnabled }) {
  const classes = useStyles();

  return (
    <CardWrapper wrappedComponent={(
      <div>
        <CardContent>
          <Chip
            icon={<OpacityIcon />}
            label="Color Temperature"
            color="secondary"
            className={classNames(classes.chip, isModeEnabled ? '' : classes.greyBg)}
          />
          <Slider
            value={ctValue}
            onChangeCommitted={updateDeviceCt}
            onChange={updateCtValue}
            className={classes.slider}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="on"
            min={1200}
            max={6500}
            marks={[
              { value: 1200, label: '1.2k' },
              { value: 6500, label: '6.5k' },
            ]}
            color="secondary"
          />
        </CardContent>
      </div>
    )}
    />
  );
}
