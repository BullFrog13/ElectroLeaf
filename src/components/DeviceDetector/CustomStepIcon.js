import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import clsx from 'clsx';

const useIconStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.contrastText,
    zIndex: 1,
    color: theme.palette.primary.main,
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function CustomStepIcon({ active, completed, icon }) {
  const classes = useIconStyles();

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
      {icons[icon]}
    </div>
  );
}
