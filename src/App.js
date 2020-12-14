import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './components/Dashboard';
import DeviceDetector from './components/DeviceDetector';
import theme from './theme';

export default () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Switch>
      <Route
        exact
        path="/"
        component={DeviceDetector}
      />
      <Route
        path="/dashboard"
        component={Dashboard}
      />
      <Route render={() => (<h1>Page not found</h1>)} />
    </Switch>
  </ThemeProvider>
);
