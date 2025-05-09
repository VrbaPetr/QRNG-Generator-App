/**
 * Basic Router File
 */
const express = require('express');
const router = express.Router();

// load files with endpoints declaration
const recordsRoutes = require('./records');
const codesRoutes   = require('./codes');
const logsRoutes    = require('./logs');
const accessRouter  = require('./access');

// register files to router
router.use('/records', recordsRoutes);
router.use('/sync_code', codesRoutes);
router.use('/logs', logsRoutes);
router.use('/access', accessRouter);

/**
 * ENDPOINT
 * return status message
 */
router.get('/', (req, res) => {
    res.send('API uspěšně spuštěna!');
  });

module.exports = router;
