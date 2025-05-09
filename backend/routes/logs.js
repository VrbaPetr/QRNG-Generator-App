/**
 * Server Logs Router
 */
const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const { log } = require('../utils/logger');

// Database Connection Pool
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error('Chyba při připojování k databázi:', err.stack);
    return;
  }
  console.log('Připojeno k databázi MySQL pod ID: ', db.threadId);
});


/**
 * ENDPOINT
 * return all logs in the database
 */
router.get('/full/', async(req, res) => {
    const ip = req.ip;
    const query = 'SELECT * FROM logs';
    db.query(query, async(err, results) => {
      if (err) {
        await log(ip, '/logs/full/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
        return res.status(500).json({ message: 'Chyba při exportování logů.', error: err });
      }
      if (results.length === 0) {
        await log(ip, '/logs/full/', 'SUCCESS', 404, 'READ', 'Navrácen prázdný výpis logů.');
        return res.status(404).json({ message: 'Záznamy nebyly nalezeny.' });
      }
      await log(ip, '/logs/full/', 'SUCCESS', 200, 'READ', 'Navrácen výpis logů.');
      res.status(200).json(results);
    });
});

/**
 * ENDPOINT
 * return all logs flagged as activity (SUCCESS)
 */
router.get('/activity/', async(req, res) => {
    const ip = req.ip;
    const query = "SELECT * FROM logs WHERE type = 'SUCCESS'";
    db.query(query, async(err, results) => {
      if (err) {
        await log(ip, '/logs/activity/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
        return res.status(500).json({ message: 'Chyba při exportování logů.', error: err });
      }
      if (results.length === 0) {
        await log(ip, '/logs/activity/', 'SUCCESS', 404, 'READ', 'Navrácen prázdný výpis logů.');
        return res.status(404).json({ message: 'Záznamy nebyly nalezeny.' });
      }
      await log(ip, '/logs/activity/', 'SUCCESS', 200, 'READ', 'Navrácen výpis logů.');
      res.status(200).json(results);
    });
});

/**
 * ENDPOINT
 * return all logs flagged as access (ACCESS)
 */
router.get('/access/', async(req, res) => {
    const ip = req.ip;
    const query = "SELECT * FROM logs WHERE type = 'ACCESS'";
    db.query(query, async(err, results) => {
      if (err) {
        await log(ip, '/logs/access/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
        return res.status(500).json({ message: 'Chyba při exportování logů.', error: err });
      }
      if (results.length === 0) {
        await log(ip, '/logs/access/', 'SUCCESS', 404, 'READ', 'Navrácen prázdný výpis logů.');
        return res.status(404).json({ message: 'Záznamy nebyly nalezeny.' });
      }
      await log(ip, '/logs/access/', 'SUCCESS', 200, 'READ', 'Navrácen výpis logů.');
      res.status(200).json(results);
    });
});

/**
 * ENDPOINT
 * return all logs flagged as server-side and data failure (ERROR)
 */
router.get('/error/', async(req, res) => {
    const ip = req.ip;
    const query = "SELECT * FROM logs WHERE type = 'ERROR'";
    db.query(query, async(err, results) => {
      if (err) {
        await log(ip, '/logs/error/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
        return res.status(500).json({ message: 'Chyba při exportování logů.', error: err });
      }
      if (results.length === 0) {
        await log(ip, '/logs/error/', 'SUCCESS', 404, 'READ', 'Navrácen prázdný výpis logů.');
        return res.status(404).json({ message: 'Záznamy nebyly nalezeny.' });
      }
      await log(ip, '/logs/error/', 'SUCCESS', 200, 'READ', 'Navrácen výpis logů.');
      res.status(200).json(results);
    });
});

module.exports = router;