/**
 * Synchronization Codes Router
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
 * create new synchronization code flagged as active
 */
router.post('/create', async(req, res) => {
    const ip = req.ip;
    const { value } = req.body;
  
    if (!value) {
      await log(ip, '/sync_code/create', 'ERROR', 400, 'CREATE', 'Chybějící data při vykládání synchronizačního kódu.');
      return res.status(400).json({ message: 'Všechny položky jsou povinné.' });
    }
  
    const query = 'INSERT INTO sync_codes (value, is_active) VALUES (?, TRUE)';
    db.query(query, [value], async(err, results) => {
      if (err) {
        await log(ip, '/sync_code/create', 'ERROR', 500, 'CREATE', 'Chyba databáze: ' + err.message);
        return res.status(500).json({ message: 'Chyba při vkládání záznamu do databáze.', error: err });
      }
      await log(ip, '/sync_code/create', 'SUCCESS', 201, 'CREATE', 'Vytvořen aktivní synchronizační kód ' + value);
      res.status(201).json({ message: 'Záznam byl úspěšně vložen.', id: results.insertId });
    });
});
  
/**
 * ENDPOINT
 * return specific synchronization code based on code value
 * @param value string
 */
router.get('/read/:value', async(req, res) => {
    const ip = req.ip;
    const { value } = req.params;
    const query = 'SELECT * FROM sync_codes WHERE value = ?';
    db.query(query, [value], async(err, results) => {
      if (err) {
        await log(ip, '/sync_code/read/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
        return res.status(500).json({ message: 'Chyba při načítání záznamu.', error: err });
      }
      if (results.length === 0) {
        await log(ip, '/sync_code/read/', 'SUCCESS', 404, 'READ', 'Zobrazení synchronizačního kódu' + value + ' s prázdným výsledkem');
        return res.status(404).json({ message: 'Záznam nebyl nalezen.' });
      }
      await log(ip, '/sync_code/read/', 'SUCCESS', 200, 'READ', 'Zobrazení záznamu synchronizačního klíče ' + value);
      res.status(200).json(results[0]);
    });
});
  
/**
 * ENDPOINT
 * set specific synchronization code based on value to inactive
 * @param value string
 */
router.get('/deactivate/:value', async(req, res) => {
      const ip = req.ip;
      const { value } = req.params;
      const query = 'UPDATE sync_codes SET is_active = FALSE WHERE value = ?'
      db.query(query, [value], async(err, results) => {
          if (err) {
            await log(ip, '/sync_code/deactive/', 'ERROR', 500, 'UPDATE', 'Chyba databáze:' + err.message);
            return res.status(500).json({ message: 'Chyba při načítání záznamu.', error: err });
          }
          if (results.length === 0) {
            await log(ip, '/sync_code/deactive/', 'SUCCESS', 404, 'UPDATE', 'Nebyl nalezen synchronizační klíč ' + value + ' k aktualizaci');
            return res.status(404).json({ message: 'Záznamy nebyly nalezeny.' });
          }
          await log(ip, '/sync_code/deactive/', 'SUCCESS', 200, 'UPDATE', 'Synchronizační klíč ' + value + ' byl úspěšně aktualizován');
          res.status(200).json(results[0]);
        });
});

module.exports = router;