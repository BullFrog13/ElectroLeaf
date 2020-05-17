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
              { value: 1200, label: '0' },
              { value: 2260, label: '20' },
              { value: 3320, label: '40' },
              { value: 4380, label: '60' },
              { value: 5440, label: '80' },
              { value: 6500, label: '100' },
            ]}
            color="secondary"
          />
        </CardContent>
        <CardDivider />
        <CardActions className={classes.alignCenter}>
          <Typography align="center" variant="subtitle1">
            {Math.round((ctValue - 1200) / 53)}
          </Typography>
        </CardActions>
      </div>
    )}
    />
  );
}
