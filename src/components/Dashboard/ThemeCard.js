import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader, Divider } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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

export default function ThemeCard({ selectedEffect, effectList, selectEffect }) {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        title="Theme"
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
      <Divider />
      <CardActions className={classes.alignCenter}>
        <Typography align="center" variant="h6" color="textSecondary">
          Pink
        </Typography>
      </CardActions>
    </Card>
  );
}
