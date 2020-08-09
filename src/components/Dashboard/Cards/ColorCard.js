import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CardContent, Chip } from '@material-ui/core';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import { ChromePicker } from 'react-color';
import classNames from 'classnames';
import CardWrapper from '../CardWrapper';

const useStyles = makeStyles((theme) => ({
  colorCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  chip: {
    width: 'fit-content',
    marginBottom: theme.spacing(4),
  },
  greyBg: {
    background: theme.palette.neutral.main,
  },
}));

const colorPickerStyles = {
  background: 'none',
  boxShadow: 'none',
  margin: '0 -16px',
  width: 'auto',
};

export default function ColorCard({
  color,
  updateDeviceColor,
  updateColor,
  isModeEnabled }) {
  const classes = useStyles();

  return (
    <CardWrapper wrappedComponent={(
      <CardContent className={classes.colorCard}>
        <Chip
          icon={<ColorLensIcon />}
          label="Color"
          color="secondary"
          className={classNames(classes.chip, isModeEnabled ? '' : classes.greyBg)}
        />
        <ChromePicker
          disableAlpha
          onChange={updateColor}
          onChangeComplete={updateDeviceColor}
          color={color}
          styles={{ default: { picker: colorPickerStyles } }}
        />
      </CardContent>
    )}
    />
  );
}
