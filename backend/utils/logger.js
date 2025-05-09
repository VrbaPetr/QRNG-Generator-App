/**
 * Utility providing async logging activity on endpoints
 */
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function logToDatabase(ip, endpoint, type, http_status, operation, description) {
  const query = 'INSERT INTO logs (source_ip, endpoint, type, http_status, operation, description) VALUES (?, ?, ?, ?, ?, ?)';
  await db.execute(query, [ip, endpoint, type, http_status, operation, description]);
}

async function log(ip, endpoint, type, http_status, operation, description) {
  await logToDatabase(ip, endpoint, type, http_status, operation, description);
}

module.exports = {
  log,
};