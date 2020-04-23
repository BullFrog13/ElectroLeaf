'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const express = require('./config/express');
const app = express();
app.listen(3001);
module.exports = app;

console.log('Server running at http://localhost:3001/');