import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CustomStepIcon from './CustomStepIcon';


const useStyles = makeStyles((theme) => ({
  stepper: {
    backgroundColor: 'transparent',
  },
  stepText: {
    color: theme.palette.primary.contrastText,
  },
}));

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

export default function CustomStepper({ activeStep }) {
  const classes = useStyles();
  const steps = ['Discover devices', 'Select device', 'Authorize device'];


  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<ColorlibConnector />}
      className={classes.stepper}
    >
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel StepIconComponent={CustomStepIcon}>
            <p className={classes.stepText}>{step}</p>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
