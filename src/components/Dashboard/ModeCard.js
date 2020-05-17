import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CardWrapper from './CardWrapper';
import CardDivider from './CardDivider';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  alignCenter: {
    alignItems: 'center',
    display: 'inline',
  },
}));

const mapColorMode = (colorMode) => {
  switch (colorMode) {
    case 'effect':
      return 'Theme';
    case 'hs':
      return 'Hue/Saturation';
    case 'ct':
      return 'Color temperature mode';
    default:
      return '';
  }
};

export default function ModeCard({ selectedEffect, effectList, selectEffect, colorMode }) {
  const classes = useStyles();
  const mappedColorMode = mapColorMode(colorMode);

  return (
    <CardWrapper wrappedComponent={(
      <div>
        <CardHeader
          title="Color Mode"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-theme-label">Theme</InputLabel>
            <Select
              labelId="outlined-theme-label"
              id="outlined-theme"
              value={selectedEffect}
              onChange={selectEffect}
              label="Theme"
            >
              <MenuItem value=""><em> </em></MenuItem>
              {
            effectList.map(effect => (
              <MenuItem key={effect} value={effect}>{effect}</MenuItem>
            ))
          }
            </Select>
          </FormControl>
        </CardContent>
        <CardDivider />
        <CardActions className={classes.alignCenter}>
          <Typography align="center" variant="subtitle1">
            {mappedColorMode}
          </Typography>
        </CardActions>
      </div>
    )}
    />
  );
}
