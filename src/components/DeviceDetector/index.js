import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DetailsOutlinedIcon from '@material-ui/icons/DetailsOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { NanoleafClient } from 'nanoleaf-client';
import Axios from 'axios';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';

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
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.default,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: theme.palette.primary.contrastText,
  },
  displayCenter: {
    textAlign: 'center',
  },
  stepper: {
    backgroundColor: 'transparent'
  }
}));

function getSteps() {
  return ['Discover devices', 'Select device', 'Authorize device'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}

// function generate(element) {
//   return devices.map((value) =>
//     React.cloneElement(element, {
//       key: value,
//     }),
//   );
// }

export default function DeviceDetector() {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({ open: false, host: '' });

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  // const [selectedDevice, selectDevice] = React.useState();
  const steps = getSteps();
  const devices = [];

  function generate(element) {
    console.log('DEV', devices);
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const goToDashboard = () => {
    // history.push({
    //   pathname: '/dashboard',
    //   // state: { state.host },
    // });
    history.push({
      pathname: '/dashboard',
      state: state.host,
    });
  };

  const toggleModal = () => {
    setState((prevState) => ({
      ...prevState,
      open: !prevState.open,
    }));
  };

  const submitIp = () => {
    toggleModal();
  };

  const discover = () => {
    Axios.get('http://localhost:3001/discover').then(res => {
      res = Array.prototype.forEach.call(res.data, child => {
        devices.push(new NanoleafClient(new URL(child.location).hostname));
      });
      console.log('TEST', devices);
      setState((prevState) => ({
        ...prevState,
        devices: devices
      }));
      handleNext();
    });
  };

  const authorize = () => {
    // goToDashboard();
    // nanoleafClient.a;
  };

  const handleSelectDevice = (device) => {
    //selectDevice(device);
  };

  return (
    <Container component="main" className={classes.container}>
      <Grid container justify="center">

        <Grid item xs={12}>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption">Optional</Typography>;
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
            </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
            </Button>
              </div>
            ) : (
                <div>
                  {/* <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography> */}
                  <div>
                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                      Back
              </Button>
                    {isStepOptional(activeStep) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSkip}
                        className={classes.button}
                      >
                        Skip
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </Grid>
        {
          activeStep === 0 &&
          <Grid item className={classes.grid} xs={4}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={discover}>
              Discover
              </Button>
          </Grid>
        }
        {
          activeStep === 1 &&
          <Grid item className={classes.grid} xs={4}>
            <Typography variant="h6" className={classes.title}>
              Discovered Devices
          </Typography>
            <div className={classes.demo}>
              <List>
                {generate(
                  <ListItem button onClick={() => handleSelectDevice}>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Single-line item"
                      secondary='Secondary text'
                    />
                    {/* <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(value)}
                        checked={checked.indexOf(value) !== -1}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemSecondaryAction> */}
                  </ListItem>
                )}
              </List>
            </div>
          </Grid>
        }
        {
          activeStep === 2 &&
          <Grid item className={classes.grid} xs={4}>

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
              value={state.host}
              onChange={(e) => {
                setState({ ...state, host: e.target.value });
              }} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={submitIp}
              disabled={!state.host}>
              Continue
              </Button>
          </Grid>
        }
      </Grid>
      {/* <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={state.open}
        onClose={toggleModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={state.open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title" className={classes.displayCenter}>
              Authorization
            </h2>
            <p id="transition-modal-description">
              Hold on-off button down for 5-7 seconds until the LED starts
              flashing and click the button.
            </p>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={authorize}
              disabled={!state.host}
            >
              Authorize
            </Button>
          </div>
        </Fade>
      </Modal> */}
    </Container>
  );
}
