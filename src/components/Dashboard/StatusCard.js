import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader, Divider } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  alignCenter: {
    alignItems: 'center',
    display: 'inline',
  },
}));

export default function StatusCard() {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader
        title="Status"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Typography
          color="textSecondary"
          gutterBottom
        >
          Word of the Day
        </Typography>
      </CardContent>
      <Divider />
      <CardActions className={classes.alignCenter}>
        <Typography align="center" variant="h6" color="textSecondary">
          OK
        </Typography>
      </CardActions>
    </Card>
  );
}
