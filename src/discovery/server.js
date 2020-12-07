const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const router = require('./routes');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();
const port = 3001;

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

app.use('/', router);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
module.exports = app;
