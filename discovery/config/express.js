const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const dgram = require('dgram');
const fs = require('fs');

const c = {
  NANOLEAF_AURORA_TARGET: 'nanoleaf_aurora:light',
  M_SEARCH: 'm-search',
  SSDP_DEFAULT_IP: '239.255.255.250',
  ANY_IP: '0.0.0.0',
  SSDP_DEFAULT_PORT: 1900,
  SSDP_SOURCE_PORT: 1901,
  NANOLEAF_PORT: 16021,
};

function broadcastSsdp(socket) {
  const query = Buffer.from( // eslint-disable-line no-undef
    'M-SEARCH * HTTP/1.1\r\n'
    + `HOST: ${c.SSDP_DEFAULT_IP}:${c.SSDP_DEFAULT_PORT}\r\n`
    + 'MAN: "ssdp:discover"\r\n'
    + 'MX: 1\r\n'
    + `ST: ${c.NANOLEAF_AURORA_TARGET}\r\n\r\n`,
  );

  socket.send(query, 0, query.length, c.SSDP_DEFAULT_PORT, c.SSDP_DEFAULT_IP);
}

function discoverNanoleaf() {
  const socket = dgram.createSocket('udp4');
  const devices = [];

  socket.on('listening', () => {
    broadcastSsdp(socket);
  });

  socket.on('message', (chunk, info) => { // eslint-disable-line no-unused-vars
    const response = chunk
      .toString()
      .trim()
      .split('\r\n');
    const result = {};
    response.forEach(item => {
      const splitter = item.indexOf(':');

      if (splitter > -1) {
        const key = item.slice(0, splitter);
        const value = item.slice(splitter, item.length);

        if (key === 'S') {
          result.uuid = value.slice(7);
        } else if (key === 'Location') {
          result.location = value.slice(2);
        } else if (key === 'nl-deviceid') {
          result.deviceId = value.slice(2);
        }
      }
    });

    devices.push(result);
  });

  socket.bind(c.SSDP_SOURCE_PORT, c.ANY_IP);

  return new Promise(resolve => {
    setTimeout(() => {
      socket.close();
      resolve(devices);
    }, 3000);
  });
}

module.exports = () => {
  const app = express();
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.get('/discover', (req, res) => {
    discoverNanoleaf().then(response => {
      res.send(response);
    });
  });

  app.get('/config', (req, res) => {
    fs.readFile('config.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Something went wrong');
      } else {
        res.send(data);
      }
    });
  });

  app.put('/config', (req, res) => {
    fs.writeFile('config.json', JSON.stringify(req.body), err => {
      if (err) {
        res.status(500).send(`Something went wrong: ${err}`);
      } else {
        res.sendStatus(200);
      }
    });
  });

  return app;
};
