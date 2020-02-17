import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './pages/Dashboard';
// import DeviceDetector from './pages/DeviceDetector';
import theme from './theme';

export default () => {
  const componentThemeWrapper = Component => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component />
    </ThemeProvider>
  );

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          component={() => componentThemeWrapper(Dashboard)}
        />
        <Route render={() => <h1>Page not found</h1>} />
      </Switch>
    </Router>
  );
};
