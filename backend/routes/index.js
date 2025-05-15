/**
 * Basic Router File
 */
const express = require('express');
const router = express.Router();

// load files with endpoints declaration
const recordsRoutes = require('./records');
const logsRoutes    = require('./logs');
const accessRoutes  = require('./access');
const tempsRoutes   = require('./temps');

// register files to router
router.use('/records', recordsRoutes);
router.use('/logs', logsRoutes);
router.use('/access', accessRoutes);
router.use('/temp', tempsRoutes);

/**
 * ENDPOINT
 * return status message
 */
router.get('/', (req, res) => {
    res.send('API uspěšně spuštěna!');
  });

module.exports = router;
