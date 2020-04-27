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
  label: {
    color: theme.palette.primary.contrastText,
  },
}));

const ColorlibConnector = withStyles(theme => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  completed: {
    '& $line': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}))(StepConnector);


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
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={CustomStepIcon}>
            <p className={classes.label}>{label}</p>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
