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
  const { value, examiner, student, program, exam, pool_range, pool_excluded} = req.body;
  const ip = req.ip;
  const is_active = true;
  const null_id = null;

  if (!value || !examiner || !student || !program || !exam || !pool_range || !pool_excluded) {
    await log(ip, '/temp/create', 'ERROR', 400, 'CREATE', 'Chybějící data při generování dočasného záznamu.');
    return res.status(400).json({ message: 'Všechny položky jsou povinné.' });
  }

  const query = 'INSERT INTO temp_records (value, examiner, student, program, exam, pool_range, pool_excluded, is_active, record_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [value, examiner, student, program, exam, pool_range, pool_excluded, is_active, null_id], async (err, results) => {
    if (err) {
      await log(ip, '/temp/create/', 'ERROR', 500, 'CREATE', 'Chyba databáze:' + err.message);
      return res.status(500).json({ message: 'Chyba při vkládání záznamu do databáze.', error: err });
    }
    await log(ip, '/temp/create/', 'SUCCESS', 201, 'CREATE', 'Úspěšné vytvoření dočasného záznamu zkoušejícího ' + res.examiner + ' pro studenta ' + res.student);
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
    const query = 'SELECT * FROM temp_records WHERE value = ?';
    db.query(query, [value], async(err, results) => {
      if (err) {
        await log(ip, '/temp/read/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
        return res.status(500).json({ message: 'Chyba při načítání záznamu.', error: err });
      }
      if (results.length === 0) {
        await log(ip, '/temp/read/', 'SUCCESS', 404, 'READ', 'Zobrazení synchronizačního kódu' + value + ' s prázdným výsledkem');
        return res.status(404).json({ message: 'Záznam nebyl nalezen.' });
      }
      await log(ip, '/temp/read/', 'SUCCESS', 200, 'READ', 'Zobrazení záznamu synchronizačního klíče ' + value);
      res.status(200).json(results[0]);
    });
});

router.get('/check_result/:value', async (req, res) => {
  const ip = req.ip;
  const { value } = req.params;

  const tempQuery = 'SELECT * FROM temp_records WHERE value = ?';
  db.query(tempQuery, [value], async (err, results) => {
    if (err) {
      await log(ip, '/temp/check/result/', 'ERROR', 500, 'READ', 'Chyba databáze: ' + err.message);
      return res.status(500).json({ message: 'Chyba při načítání záznamu.', error: err });
    }

    if (results.length === 0) {
      await log(ip, '/temp/check/result/', 'SUCCESS', 404, 'READ', 'Zobrazení synchronizačního kódu ' + value + ' s prázdným výsledkem');
      return res.status(404).json({ message: 'Záznam nebyl nalezen.' });
    }

    const tempRecord = results[0];

    // Pokud není record_id vyplněn
    if (tempRecord.record_id == null) {
      await log(ip, '/temp/check/result/', 'SUCCESS', 200, 'READ', 'Záznam existuje, ale record_id je null pro ' + value);
      return res.status(200).json({ status: false });
    }

    // Pokud record_id je k dispozici
    const genQuery = 'SELECT result FROM generated_records WHERE id = ?';
    db.query(genQuery, [tempRecord.record_id], async (err2, genResults) => {
      if (err2) {
        await log(ip, '/temp/check/result/', 'ERROR', 500, 'READ', 'Chyba při čtení výsledku: ' + err2.message);
        return res.status(500).json({ message: 'Chyba při načítání výsledku.', error: err2 });
      }

      if (genResults.length === 0) {
        await log(ip, '/temp/check/result/', 'SUCCESS', 404, 'READ', 'Záznam s record_id ' + tempRecord.record_id + ' nenalezen.');
        return res.status(404).json({ message: 'Výsledek nebyl nalezen.' });
      }

      const resultValue = genResults[0].result;
      await log(ip, '/temp/check/result/', 'SUCCESS', 200, 'READ', 'Výsledek úspěšně nalezen pro ' + value);
      return res.status(200).json({ status: true, value: resultValue });
    });
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
      const query = 'UPDATE temp_records SET is_active = FALSE WHERE value = ?'
      db.query(query, [value], async(err, results) => {
          if (err) {
            await log(ip, '/temp/deactive/', 'ERROR', 500, 'UPDATE', 'Chyba databáze:' + err.message);
            return res.status(500).json({ message: 'Chyba při načítání záznamu.', error: err });
          }
          if (results.length === 0) {
            await log(ip, '/temp/deactive/', 'SUCCESS', 404, 'UPDATE', 'Nebyl nalezen synchronizační klíč ' + value + ' k aktualizaci');
            return res.status(404).json({ message: 'Záznamy nebyly nalezeny.' });
          }
          await log(ip, '/temp/deactive/', 'SUCCESS', 200, 'UPDATE', 'Synchronizační klíč ' + value + ' byl úspěšně deaktivován');
          res.status(200).json(results[0]);
        });
});

module.exports = router;