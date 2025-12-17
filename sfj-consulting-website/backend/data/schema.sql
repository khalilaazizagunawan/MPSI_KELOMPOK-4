-- =============================================
-- SFJ Consulting Website - MySQL Database Schema
-- =============================================

-- Buat database
CREATE DATABASE IF NOT EXISTS sfj_consulting;
USE sfj_consulting;

-- =============================================
-- Tabel Users (untuk login admin)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Tabel Team Members
-- =============================================
CREATE TABLE IF NOT EXISTS team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT,
    avatar VARCHAR(500),
    quote TEXT,
    status VARCHAR(50) DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Tabel Bookings (Konsultasi)
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    whatsapp VARCHAR(50) NOT NULL,
    service VARCHAR(255) NOT NULL,
    message TEXT,
    booking_date DATE NOT NULL,
    booking_time VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Menunggu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Tabel Reviews (Ulasan)
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_anonymous TINYINT DEFAULT 0,
    comment TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Tampil',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Tabel Activity Logs
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- Data Default
-- =============================================

-- Default Admin User (username: admin, password: admin123)
INSERT INTO users (username, password, email, role) VALUES 
('admin', 'admin123', 'admin@sfj.id', 'admin');

-- Default Team Members
INSERT INTO team_members (name, position, description, quote, status) VALUES 
('Soni Fajar S.G', 'CEO / SPBE Expert', 'Founder & CEO', 'Membawa perubahan melalui teknologi untuk masa depan yang lebih baik', 'Aktif'),
('Ridha Hanafi', 'COBIT & TOGAF Expert', 'Senior Consultant', 'Membangun arsitektur pemerintahan yang terintegrasi dan efisien bagi pelayanan publik', 'Aktif'),
('Andi Agus S.', 'ITPM & EA Architect', 'Lead Architect', 'Mewujudkan kebijakan yang mendukung tata kelola digital yang aman dan efektif', 'Aktif'),
('Arian Nurrifqhi', 'Digital Transformation Specialist', 'Specialist', 'Mengubah data menjadi wawasan untuk pelayanan publik yang unggul', 'Aktif');

