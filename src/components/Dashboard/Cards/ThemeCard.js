import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import Chip from '@material-ui/core/Chip';
import classNames from 'classnames';
import CardWrapper from '../CardWrapper';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    display: 'flex',
  },
  chip: {
    marginBottom: theme.spacing(6),
  },
  greyBg: {
    background: theme.palette.neutral.main,
  },
  dropdownLabel: {
    color: theme.palette.common.white,
  },
  dropdownSelect: {
    color: theme.palette.common.white,
    backgroundColor: 'rgba(190, 190, 190, 0.2)',
  },
}));

export default function ThemeCard({ selectedEffect, effectList, selectEffect, isModeEnabled }) {
  const classes = useStyles();

  return (
    <CardWrapper wrappedComponent={(
      <div>
        <CardContent>
          <Chip
            icon={<ControlCameraIcon />}
            label="Theme"
            color="secondary"
            className={classNames(classes.chip, isModeEnabled ? '' : classes.greyBg)}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel className={classes.dropdownLabel} htmlFor="outlined-theme-label">Theme</InputLabel>
            <Select
              labelId="outlined-theme-label"
              id="outlined-theme"
              className={classes.dropdownSelect}
              value={selectedEffect}
              onChange={selectEffect}
              label="Theme"
            >
              <MenuItem value=""><em> </em></MenuItem>
              {
            effectList.map(effect => (
              // <div>
              <MenuItem key={effect} value={effect}>{effect}</MenuItem>
              // <h6>123</h6>
              //  </div>
            ))
          }
            </Select>
          </FormControl>
        </CardContent>
      </div>
    )}
    />
  );
}
