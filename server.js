/**
 * Express.js Basic Server File
 */
const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const routes = require('./routes/index');
const app = express();

// port dedicated for API
const port = 3000;

// define data format
app.use(express.json());
app.use('/', routes);

// API activation alert
app.listen(port, () => {
  console.log(`API spuštěna na http://localhost:${port}`);
});
