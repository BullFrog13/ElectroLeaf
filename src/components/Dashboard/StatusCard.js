import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader } from '@material-ui/core';
import CardWrapper from './CardWrapper';
import CardDivider from './CardDivider';

const useStyles = makeStyles((theme) => ({
  alignCenter: {
    alignItems: 'center',
    display: 'inline',
  },
  divider: {
    color: theme.palette.common.white,
    background: theme.palette.grey[500],
  },
}));

export default function StatusCard() {
  const classes = useStyles();

  return (
    <CardWrapper wrappedComponent={(
      <div>
        <CardHeader
          title="Status"
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Typography
            gutterBottom
          >
            Word of the Day
          </Typography>
        </CardContent>
        <CardDivider />
        <CardActions classes={{ root: classes.alignCenter }}>
          <Typography align="center" variant="subtitle1">
            OK
          </Typography>
        </CardActions>
      </div>
    )}
    />
  );
}
