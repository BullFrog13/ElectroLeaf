const express = require('express');
const fs = require('fs');
const path = require('path');
const discoverNanoleaf = require('./discoverNanoleaf');

const router = express.Router();

const getAppDataPath = () => {
  switch (process.platform) {
    case 'darwin': {
      return path.join(process.env.HOME, 'Library', 'Application Support', 'ElectroLeaf');
    }
    case 'win32': {
      return path.join(process.env.APPDATA, 'ElectroLeaf');
    }
    case 'linux': {
      return path.join(process.env.HOME, '.ElectroLeaf');
    }
    default: {
      console.log('Unsupported platform!');
      process.exit(1);
    }
  }
};

const getConfigPath = (isForCreating = false) => {
  const appDatatDirPath = getAppDataPath();

  // Create appDataDir if not exist
  if (isForCreating && !fs.existsSync(appDatatDirPath)) {
    fs.mkdirSync(appDatatDirPath);
  }

  return path.join(appDatatDirPath, 'config.json');
};

router.get('/discover', (req, res) => {
  discoverNanoleaf().then(response => {
    res.send(response);
  });
}).get('/config', (req, res) => {
  fs.readFile(getConfigPath(), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Something went wrong');
    } else {
      res.send(data);
    }
  });
}).put('/config', (req, res) => {
  fs.writeFile(getConfigPath(true), JSON.stringify(req.body), err => {
    if (err) {
      res.send(err);
    } else {
      res.sendStatus(200);
    }
  });
}).delete('/config', (req, res) => {
  fs.unlink(getConfigPath(), err => {
    if (err) {
      res.status(500).send(`Something went wrong: ${err}`);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
