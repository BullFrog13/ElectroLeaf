import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import clsx from 'clsx';

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});

export default function CustomStepIcon({ active, completed, icon }) {
  const classes = useColorlibStepIconStyles();

  const icons = {
    1: <SearchIcon />,
    2: <PlaylistAddCheckIcon />,
    3: <VpnKeyOutlinedIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(icon)]}
    </div>
  );
}
