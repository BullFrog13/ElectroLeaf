import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  divider: {
    color: theme.palette.common.white,
    background: theme.palette.grey[600],
  },
}));

export default function CardDivider() {
  const classes = useStyles();

  return (
    <Divider className={classes.divider} />
  );
}
