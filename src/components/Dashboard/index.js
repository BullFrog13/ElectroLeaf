import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import { useHistory } from 'react-router-dom';
import AppsIcon from '@material-ui/icons/Apps';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';
import ColorPicker from 'material-ui-color-picker';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import NanoleafImage from '../../assets/images/img.jpg';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import CardActions from '@material-ui/core/CardActions';
import { CardHeader, Divider } from '@material-ui/core';
import { ChromePicker } from 'react-color'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  media: {
    height: 240,
  },
  colorCard: {
    height: 300,
  },
  toolbar: theme.mixins.toolbar,
  alignCenter: {
    alignItems: 'center',
    display: 'inline'
  }
}));

function TabPanel(props) {
  const { children, tabValue, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={tabValue !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tabValue === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  tabValue: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  const classes = useStyles();
  const history = useHistory();

  if (!history.location.state) history.push('');

  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    value: 30,
    ctValue: 1200,
    tabValue: 0
  });

  const [value, setValue] = React.useState(30);
  const [ctValue, setCtValue] = React.useState(1200);
  const [tabValue, setTabValue] = React.useState(0);
  const [colorValue, setColorValue] = React.useState('#ff0000');

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleTabsChange = (event, newValue) => {
    setTabValue(newValue);
  }

  const handleBrightnessSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCtSliderChange = (event, newValue) => {
    setCtValue(newValue);
  };

  const handleColorChange = (color, event) => {
    setColorValue(color);
  };


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            ElectroLeaf
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />

        <List>
          <ListItem button>
            <ListItemIcon>
              <AppsIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={'General'} />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ChangeHistoryIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={'Devices'} />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              {/* <div>
                <Switch
                  checked={state.checkedA}
                  onChange={handleChange}
                  name="checkedA"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div> */}

              <Card>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={NanoleafImage}
                    title="Contemplative Reptile"
                  />
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Card>
                <Tabs value={tabValue} onChange={handleTabsChange} aria-label="simple tabs example" centered>
                  <Tab label="RGB" {...a11yProps(0)} />
                  <Tab label="Hex" {...a11yProps(1)} />
                  <Tab label="HSL" {...a11yProps(2)} />
                </Tabs>

                <CardContent className={classes.colorCard}>
                  <TabPanel tabValue={tabValue} index={0}>
                    {/* <ColorPicker
                      name='color'
                      defaultValue='#000'
                      // value={this.state.color} - for controlled component
                      onChange={color => console.log(color)} /> */}
                    <ChromePicker disableAlpha={true} onChange={handleColorChange} color={colorValue} />
                  </TabPanel>
                  <TabPanel tabValue={tabValue} index={1}>
                    Item Two
                  </TabPanel>
                  <TabPanel tabValue={tabValue} index={2}>
                    Item Three
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} lg={3}>
              <Card>
                <CardHeader title="Brightness" titleTypographyProps={{ variant: 'h6' }}>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={value}
                    onChange={handleBrightnessSliderChange}
                    aria-labelledby="continuous-slider"
                    marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]}
                  />
                </CardContent>
                <Divider />
                <CardActions className={classes.alignCenter}>
                  <Typography align="center" variant="h6" color="textSecondary">
                    {value}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Card>
                <CardHeader title="Color Temperature" titleTypographyProps={{ variant: 'h6' }}>
                </CardHeader>
                <CardContent>
                  <Slider
                    value={ctValue}
                    onChange={handleCtSliderChange}
                    aria-labelledby="continuous-slider"
                    min={1200}
                    max={6500}
                    marks={[{ value: 1200, label: '1200' }, { value: 6500, label: '6500' }]}
                  />
                </CardContent>
                <Divider />
                <CardActions className={classes.alignCenter}>
                  <Typography align="center" variant="h6" color="textSecondary">
                    {ctValue}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Card>
                <CardHeader title="Theme" titleTypographyProps={{ variant: 'h6' }}>
                </CardHeader>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Word of the Day
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions className={classes.alignCenter}>
                  <Typography align="center" variant="h6" color="textSecondary">
                    Pink
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <Card>
                <CardHeader title="Status" titleTypographyProps={{ variant: 'h6' }}>
                </CardHeader>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Word of the Day
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions className={classes.alignCenter}>
                  <Typography align="center" variant="h6" color="textSecondary">
                    OK
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
