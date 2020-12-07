import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './components/Dashboard';
import DeviceDetector from './components/DeviceDetector';
import theme from './theme';

export default () => (
  <Router>
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
        <Route path="*" render={() => <h1>Page not found</h1>} />
      </Switch>
    </ThemeProvider>
  </Router>
);
