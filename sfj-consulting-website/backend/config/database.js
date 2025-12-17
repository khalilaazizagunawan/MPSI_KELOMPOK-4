const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// MySQL Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sfj_consulting',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
let pool = null;

const getPool = () => {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
        console.log('MySQL connection pool created');
    }
    return pool;
};

// Initialize database and tables
const initDatabase = async () => {
    try {
        // First connect without database to create it if not exists
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });

        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
        await tempConnection.end();
        console.log(`Database '${dbConfig.database}' ready`);

        // Now connect to the database and create tables
        const db = getPool();

        // Users table (for admin login)
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                role VARCHAR(50) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Team members table
        await db.query(`
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
            )
        `);

        // Bookings/Consultations table
        await db.query(`
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
            )
        `);

        // Reviews/Comments table
        await db.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                is_anonymous TINYINT DEFAULT 0,
                comment TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'Tampil',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Activity logs table
        await db.query(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                action VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // Documents table
        await db.query(`
            CREATE TABLE IF NOT EXISTS documents (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                filename VARCHAR(255),
                filepath VARCHAR(500),
                filesize VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Gallery items table (for documentation gallery)
        await db.query(`
            CREATE TABLE IF NOT EXISTS gallery_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                image_path VARCHAR(500) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('All tables created successfully');

        // Insert default gallery items if not exists
        const [existingGallery] = await db.query('SELECT id FROM gallery_items LIMIT 1');
        if (existingGallery.length === 0) {
            await db.query(`
                INSERT INTO gallery_items (image_path, title, description, display_order) VALUES 
                ('public/doc/doc_1.jpg', 'Leader in Its Field', 'PT. Solusi Fikir Jenius telah berdiri sejak 2015 di bidang konsultasi transformasi digital dan SPBE. Perusahaan kami bergerak di bidang penyediaan layanan konsultasi strategis, tata kelola TIK, dan implementasi SPBE, dengan lahan operasional seluas lebih dari 2 hektar serta didukung oleh lebih dari 50 tenaga ahli berpengalaman dan berdedikasi tinggi sehingga produk dan layanan kami menjadi pilihan utama bagi instansi pemerintah maupun swasta di Indonesia.', 1),
                ('public/doc/doc_2.jpg', 'Proyek SPBE Sukses', 'Dalam proyek ini, kami berhasil mengimplementasikan sistem SPBE untuk instansi pemerintah, meningkatkan efisiensi operasional hingga 40%. Tim kami bekerja sama dengan klien untuk memastikan integrasi sempurna dengan infrastruktur existing.', 2),
                ('public/doc/doc_3.jpg', 'Workshop Pelatihan', 'Workshop pelatihan kami fokus pada pengembangan skill SDM di bidang tata kelola TI. Lebih dari 100 peserta telah mengikuti program ini, dengan feedback positif mengenai pendekatan praktis dan interaktif.', 3),
                ('public/doc/doc_4.jpg', 'Audit TIK Inovatif', 'Audit TIK kami mencakup evaluasi keamanan dan performa sistem. Hasil audit membantu klien mengidentifikasi risiko dan mengimplementasikan perbaikan yang hemat biaya.', 4),
                ('public/doc/doc_5.jpg', 'Kolaborasi dengan Vendor', 'Kerja sama dengan lebih dari 60 vendor memungkinkan kami menyediakan solusi teknologi terkini. Dokumentasi ini menunjukkan salah satu proyek kolaboratif yang sukses di sektor publik.', 5),
                ('public/doc/doc_6.jpg', 'Implementasi SPBE Berhasil', 'Kami telah berhasil mengimplementasikan Sistem Penyelenggaraan Pemerintahan Berbasis Elektronik (SPBE) di beberapa instansi pemerintah daerah. Proyek ini mencakup integrasi aplikasi layanan publik, peningkatan interoperabilitas data antar-OPD, serta penerapan tata kelola TIK yang sesuai regulasi nasional. Hasilnya, efisiensi pelayanan publik meningkat signifikan dan akses masyarakat terhadap layanan digital menjadi lebih mudah dan cepat.', 6)
            `);
            console.log('Default gallery items created');
        }

        // Insert default admin user if not exists
        const [existingAdmin] = await db.query('SELECT id FROM users WHERE username = ?', ['admin']);
        if (existingAdmin.length === 0) {
            await db.query(
                'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin123', 'admin@sfj.id', 'admin']
            );
            console.log('Default admin user created');
        }

        // Insert default team members if not exists
        const [existingTeam] = await db.query('SELECT id FROM team_members LIMIT 1');
        if (existingTeam.length === 0) {
            await db.query(`
                INSERT INTO team_members (name, position, description, quote, status) VALUES 
                ('Soni Fajar S.G', 'CEO / SPBE Expert', 'Founder & CEO', 'Membawa perubahan melalui teknologi untuk masa depan yang lebih baik', 'Aktif'),
                ('Ridha Hanafi', 'COBIT & TOGAF Expert', 'Senior Consultant', 'Membangun arsitektur pemerintahan yang terintegrasi dan efisien bagi pelayanan publik', 'Aktif'),
                ('Andi Agus S.', 'ITPM & EA Architect', 'Lead Architect', 'Mewujudkan kebijakan yang mendukung tata kelola digital yang aman dan efektif', 'Aktif'),
                ('Arian Nurrifqhi', 'Digital Transformation Specialist', 'Specialist', 'Mengubah data menjadi wawasan untuk pelayanan publik yang unggul', 'Aktif')
            `);
            console.log('Default team members created');
        }

        console.log('=========================================');
        console.log('MySQL Database initialized successfully!');
        console.log(`Host: ${dbConfig.host}`);
        console.log(`Database: ${dbConfig.database}`);
        console.log('=========================================');
        
    } catch (error) {
        console.error('Database initialization error:', error.message);
        console.error('Make sure MySQL is running (XAMPP/Laragon)');
        throw error;
    }
};

// Helper functions for queries
const dbRun = async (sql, params = []) => {
    try {
        const db = getPool();
        const [result] = await db.query(sql, params);
        return { lastID: result.insertId, changes: result.affectedRows };
    } catch (error) {
        console.error('dbRun error:', error.message);
        throw error;
    }
};

const dbGet = async (sql, params = []) => {
    try {
        const db = getPool();
        const [rows] = await db.query(sql, params);
        return rows[0] || null;
    } catch (error) {
        console.error('dbGet error:', error.message);
        throw error;
    }
};

const dbAll = async (sql, params = []) => {
    try {
        const db = getPool();
        const [rows] = await db.query(sql, params);
        return rows;
    } catch (error) {
        console.error('dbAll error:', error.message);
        throw error;
    }
};

module.exports = {
    getPool,
    initDatabase,
    dbRun,
    dbGet,
    dbAll
};
