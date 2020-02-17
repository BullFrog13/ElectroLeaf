import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2F2FA2',
    },
    secondary: {
      main: '#ff4081',
    },
    error: {
      main: red.A400,
      light: '#f9eff1',
    },
    background: {
      default: '#fff',
      gradient: 'linear-gradient(to right, #2F2FA2 0%, #ff4081 100%);',
    },
    button: {
      redGradient: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      blueGradient: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    },
  },
});

export default theme;
