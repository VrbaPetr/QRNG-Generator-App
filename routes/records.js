/**
 * Generated Values Router
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
 * create new record with generated result
 */
router.post('/insert_record', async (req, res) => {
  const { examiner, student, program, exam, pool_range, pool_excluded, result } = req.body;
  const ip = req.ip;

  if (!examiner || !student || !program || !exam || !pool_range || !pool_excluded || !result) {
    await log(ip, '/records/insert_record', 'ERROR', 400, 'CREATE', 'Chybějící data při generování zkouškové otázky.');
    return res.status(400).json({ message: 'Všechny položky jsou povinné.' });
  }

  const query = 'INSERT INTO generated_records (examiner, student, program, exam, pool_range, pool_excluded, result) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [examiner, student, program, exam, pool_range, pool_excluded, result], async (err, results) => {
    if (err) {
      await log(ip, '/records/insert_record/', 'ERROR', 500, 'CREATE', 'Chyba databáze:' + err.message);
      return res.status(500).json({ message: 'Chyba při vkládání záznamu do databáze.', error: err });
    }
    await log(ip, '/records/insert_record/', 'SUCCESS', 201, 'CREATE', 'Úspěšné vytvoření záznamu zkoušejícího ' + res.examiner + ' pro studenta ' + res.student);
    res.status(201).json({ message: 'Záznam byl úspěšně vložen.', id: results.insertId });
  });
});

/**
 * ENDPOINT
 * return specific record based on id
 * @param id int
 */
router.get('/record/:id', async (req, res) => {
  const ip = req.ip;
  const { id } = req.params;

  const query = 'SELECT * FROM generated_records WHERE id = ?';
  db.query(query, [id], async (err, results) => {
    if (err) {
      await log(ip, '/records/record/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
      return res.status(500).json({ message: 'Chyba při načítání záznamu.', error: err });
    }
    if (results.length === 0) {
      await log(ip, '/records/record/', 'SUCCESS', 404, 'READ', 'Zobrazení záznamu o generování zkouškové otázky s id ' + req.params.id + ' s prázdným výsledkem');
      return res.status(404).json({ message: 'Záznam nebyl nalezen.' });
    }
    await log(ip, '/records/record/', 'SUCCESS', 200, 'READ', 'Zobrazení záznamu o generování zkouškové otázky s id ' + req.params.id);
    res.status(200).json(results[0]);
  });
});

/**
 * ENDPOINT
 * return all records based on examiner ID
 * @param id string
 */
router.get('/examiner_records/:id', async (req, res) => {
  const ip = req.ip;
  const { id } = req.params;
  const query = 'SELECT * FROM generated_records WHERE examiner = ?';
  db.query(query, [id], async (err, results) => {
      if (err) {
        await log(ip, '/records/examiner_records/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
        return res.status(500).json({ message: 'Chyba při načítání záznamu.', error: err });
      }
      if (results.length === 0) {
        await log(ip, '/records/examiner_records/', 'SUCCESS', 404, 'READ', 'Zobrazení záznamu o generování zkouškových otázek zkoušejícího ' + req.params.id + ' s prázdným výsledkem');
        return res.status(404).json({ message: 'Záznamy nebyly nalezeny.' });
      }
      await log(ip, '/records/examiner_records/', 'SUCCESS', 200, 'READ', 'Zobrazení záznamu o generování zkouškových otázek zkoušejícího ' + req.params.id);
      res.status(200).json(results[0]);
  });
})

/**
 * ENDPOINT
 * return all records
 */
router.get('/all_records', async(req, res) => {
  const ip = req.ip;
  const query = 'SELECT * FROM generated_records';
  db.query(query, async(err, results) => {
    if (err) {
      await log(ip, '/records/all_records/', 'ERROR', 500, 'READ', 'Chyba databáze:' + err.message);
      return res.status(500).json({ message: 'Chyba při načítání záznamů.', error: err });
    }
    if (results.length === 0) {
      await log(ip, '/records/all_records/', 'SUCCESS', 404, 'READ', 'Zobrazení všech záznamů o generování zkouškových otázek s prázdným výsledkem');
      return res.status(404).json({ message: 'Záznamy nebyly nalezeny.' });
    }
    await log(ip, '/records/all_records/', 'SUCCESS', 200, 'READ', 'Zobrazení všech záznamů o generování zkouškových otázek');
    res.status(200).json(results);
  });
});

module.exports = router;
