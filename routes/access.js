/**
 * Access Evidation Router
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
 * log successfull acces from STAG entrypoint
 * @param user string
 */
router.get('/login/:user', async(req, res) => {
    const ip = req.ip;
    await log(ip, '/access/login/', 'ACCESS', 200, 'CREATE', req.body.user + ' se úspěšně přihlásil do systému.');
    return res.status(200).json({message: 'hodnota v pořádku uložena.'});
});

/**
 * ENDPOINT
 * log successfull logout from system
 * @param user string
 */
router.get('/logout/:user', async(req, res) => {
    const ip = req.ip;
    await log(ip, '/access/logout/', 'ACCESS', 200, 'CREATE', req.body.user + ' se úspěšně odhlásil ze systému.');
    return res.status(200).json({message: 'hodnota v pořádku uložena.'});
});

module.exports = router;