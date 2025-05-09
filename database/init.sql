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


-- TEST DATA
INSERT INTO generated_records (examiner, student, program, exam, pool_range, pool_excluded, result) VALUES
('EX001', 'ST001', 'Informatika', 'Matematika I', 100, '5;10;15', 85),
('EX002', 'ST002', 'Fyzika', 'Mechanika', 80, '3;6;9', 73),
('EX003', 'ST003', 'Informatika', 'Programování', 120, '2;4;6', 91),
('EX001', 'ST004', 'Matematika', 'Algebra', 90, '1;3;5', 77),
('EX004', 'ST005', 'Chemie', 'Organická chemie', 70, '7;14;21', 64),
('EX002', 'ST006', 'Biologie', 'Genetika', 60, '8;16;24', 88),
('EX003', 'ST007', 'Informatika', 'Databáze', 110, '11;22;33', 95),
('EX005', 'ST008', 'Fyzika', 'Optika', 75, '12;24;36', 82),
('EX006', 'ST009', 'Matematika', 'Statistika', 85, '9;18;27', 79),
('EX007', 'ST010', 'Informatika', 'Sítě', 95, '10;20;30', 87);

INSERT INTO sync_codes (value, is_active) VALUES
('A1B2C3D4', TRUE),
('E5F6G7H8', FALSE),
('I9J0K1L2', TRUE),
('M3N4O5P6', TRUE),
('Q7R8S9T0', FALSE),
('U1V2W3X4', TRUE),
('Y5Z6A7B8', TRUE),
('C9D0E1F2', FALSE),
('G3H4I5J6', TRUE),
('K7L8M9N0', TRUE);