import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.secondary.contrastText,
    borderColor: theme.palette.primary.contrastText,
  },
}));

export default function CardWrapper({ wrappedComponent }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      {wrappedComponent}
    </Card>
  );
}
