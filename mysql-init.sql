-- Script untuk inisialisasi database
-- File ini akan dijalankan otomatis saat MySQL container pertama kali start

-- Create database jika belum ada
CREATE DATABASE IF NOT EXISTS survey_db;

-- Grant permissions
GRANT ALL PRIVILEGES ON survey_db.* TO 'survey_user'@'%';
FLUSH PRIVILEGES;

-- Use database
USE survey_db;

-- Database siap digunakan!
-- Tabel akan dibuat oleh Prisma migration
