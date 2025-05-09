CREATE DATABASE IF NOT EXISTS qrng_generated_results
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_czech_ci;

USE qrng_generated_results;

CREATE TABLE IF NOT EXISTS generated_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    examiner VARCHAR(255),
    student VARCHAR(255),
    program VARCHAR(255),
    exam VARCHAR(255),
    pool_range INT,
    pool_excluded TEXT,
    result INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci;

CREATE TABLE IF NOT EXISTS sync_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(1024),
    is_active BOOLEAN DEFAULT TRUE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_czech_ci;

CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  source_ip VARCHAR(255),
  endpoint VARCHAR(255),
  type VARCHAR(255),
  http_status INT,
  operation VARCHAR(10) NOT NULL,
  description TEXT
);
