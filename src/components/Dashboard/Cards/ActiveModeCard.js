import React, { } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import { Button, ButtonGroup, CardContent, Chip } from '@material-ui/core';
import CardWrapper from '../CardWrapper';


const useStyles = makeStyles((theme) => ({
  chip: {
    marginBottom: theme.spacing(2),
  },
  buttonGroup: {
    width: '100%',
  },
  buttonLabel: {
    textTransform: 'none',
  },
  activeButton: {
    background: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
}));

const isButtonActive = (colorMode, buttonId) => (colorMode === 'effect' && buttonId === 0)
      || (colorMode === 'hs' && buttonId === 1)
      || (colorMode === 'ct' && buttonId === 2);

const buttons = [
  'Theme',
  'Hue/Saturation',
  'Color temperature mode',
];

export default function ActiveModeCard({ colorMode }) {
  const classes = useStyles();

  return (
    <CardWrapper wrappedComponent={(
      <div>
        <CardContent>
          <Chip
            icon={<BrokenImageIcon />}
            label="Active Mode"
            color="secondary"
            className={classes.chip}
          />
          <ButtonGroup
            orientation="vertical"
            color="secondary"
            aria-label="vertical contained primary button group"
            variant="text"
            className={classes.buttonGroup}
          >
            {buttons.map((buttonText, id) => (
              <Button key={id} classes={{ root: isButtonActive(colorMode, id) ? classes.activeButton : '', label: classes.buttonLabel }}>
                {buttonText}
              </Button>
            ))}
          </ButtonGroup>
        </CardContent>
      </div>
    )}
    />
  );
}
