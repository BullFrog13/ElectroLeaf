import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import Chip from '@material-ui/core/Chip';
import classNames from 'classnames';
import { ListItemText } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import convert from 'color-convert';
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
  menuPaper: {
    maxHeight: '500px',
  },
  menuItem: {
    display: 'block',
    borderBottom: `0.5px solid ${theme.palette.primary.light}`,
  },
  root: {
    flexGrow: 1,
  },
}));

export default function ThemeCard({ selectedEffect, effectList, selectEffect, isModeEnabled }) {
  const classes = useStyles();

  const getHexColor = (palette) => {
    const hex = `#${convert.hsv.hex([
      palette.hue,
      palette.saturation,
      palette.brightness,
    ])}`;

    return hex;
  };

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
            <InputLabel className={classes.dropdownLabel} htmlFor="outlined-theme-label">Select Theme</InputLabel>
            <Select
              labelId="outlined-theme-label"
              id="outlined-theme"
              className={classes.dropdownSelect}
              value={Object.keys(selectedEffect).length > 0 ? selectedEffect : ''}
              onChange={selectEffect}
              label="Theme"
              displayEmpty
              MenuProps={{ classes: { paper: classes.menuPaper } }}
            >
              {
            effectList.map(effect => (
              <MenuItem key={effect.animName} value={effect} className={classes.menuItem}>
                <ListItemText>
                  {effect.animName}
                </ListItemText>
                <div className={classes.root}>
                  <Grid container>
                    {
                      effect.palette.map((color, index) => (
                        <Grid key={`${String(effect.animName)}${index}`} item xs style={{ backgroundColor: getHexColor(color), height: '15px' }} />
                      ))
                    }
                  </Grid>
                </div>
              </MenuItem>
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
