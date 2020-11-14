import React, { } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { CardContent } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import NanoleafLayout from 'nanoleaf-layout/lib/NanoleafLayout';
import CardWrapper from '../CardWrapper';
import theme from '../../../theme';

// const useStyles = makeStyles((theme) => ({
//   chip: {
//     marginBottom: theme.spacing(8),
//   },
//   slider: {
//     width: '96%',
//   },
//   greyBg: {
//     background: theme.palette.neutral.main,
//   },
// }));

export default function NanoleafLayoutCard({ colorMode, color, layout, rotation }) {
  // const classes = useStyles();

  const getConicGradientPalette = () => {
    let colorString = String();

    const panels = Array.from(layout.positionData);

    panels.forEach(panel => {
      colorString += `${panel.color},`;
    });

    // finishing with starting color to create smooth transition
    colorString += panels[0].color;

    return `conic-gradient(${colorString})`;
  };

  return (
    <Box display="flex" style={{ width: '100%', height: '100%', background: colorMode === 'effect' ? getConicGradientPalette() : `#${color}`, borderRadius: '10px', justifyContent: 'center' }}>
      <Box display="flex" style={{ width: '98%', height: '98%', marginTop: '1%', backgroundColor: theme.palette.primary.main, borderRadius: '10px', justifyContent: 'center' }}>
        <NanoleafLayout data={layout} svgStyle={{ width: '75%', marginLeft: '4%', transform: `rotate(${rotation}deg)` }} />
      </Box>
    </Box>
  );
}
