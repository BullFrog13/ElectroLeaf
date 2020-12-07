const express = require('express');
const fs = require('fs');
const discoverNanoleaf = require('./discoverNanoleaf');

const router = express.Router();

router.get('/discover', (req, res) => {
  discoverNanoleaf().then(response => {
    res.send(response);
  });
}).get('/config', (req, res) => {
  fs.readFile('config.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Something went wrong');
    } else {
      res.send(data);
    }
  });
}).put('/config', (req, res) => {
  fs.writeFile('config.json', JSON.stringify(req.body), err => {
    if (err) {
      res.status(500).send(`Something went wrong: ${err}`);
    } else {
      res.sendStatus(200);
    }
  });
}).delete('/config', (req, res) => {
  fs.unlink('config.json', err => {
    if (err) {
      res.status(500).send(`Something went wrong: ${err}`);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
