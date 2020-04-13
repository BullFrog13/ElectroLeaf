import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import DetailsOutlinedIcon from '@material-ui/icons/DetailsOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
  },
  grid: {
    marginTop: -theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: theme.palette.button.redGradient,
  },
  grayText: {
    color: theme.palette.primary.light,
  },
  whiteText: {
    color: theme.palette.primary.contrastText,
  },
  ipTextField: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
}));

export default function SignIn() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <CssBaseline />
      <Grid container justify="center" className={classes.grid}>
        <Avatar className={classes.avatar}>
          <DetailsOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className={classes.whiteText}>
          Locate Device
        </Typography>
        <TextField
          id="filled-basic"
          label="Enter the Device IP"
          variant="filled"
          color="secondary"
          className={classes.ipTextField}
          InputLabelProps={{ className: classes.grayText }}
          InputProps={{ className: classes.whiteText }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Continue
        </Button>
      </Grid>
    </Container>
  );
}
