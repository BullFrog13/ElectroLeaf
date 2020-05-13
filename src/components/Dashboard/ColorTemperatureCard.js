import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader, Divider } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import CardWrapper from './CardWrapper';


const useStyles = makeStyles(() => ({
  alignCenter: {
    alignItems: 'center',
    display: 'inline',
  },
}));

export default function ColorTemperatureCard({
  ctValue,
  updateDeviceCt,
  updateCtValue }) {
  const classes = useStyles();

  return (
    <CardWrapper wrappedComponent={(
      <div>
        <CardHeader
          title="Color Temperature"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Slider
            value={ctValue}
            onChangeCommitted={updateDeviceCt}
            onChange={updateCtValue}
            aria-labelledby="continuous-slider"
            min={1200}
            max={6500}
            marks={[
              { value: 1200, label: '1200' },
              { value: 6500, label: '6500' },
            ]}
          />
        </CardContent>
        <Divider />
        <CardActions className={classes.alignCenter}>
          <Typography align="center" variant="h6" color="textSecondary">
            {ctValue}
          </Typography>
        </CardActions>
      </div>
    )}
    />
  );
}
