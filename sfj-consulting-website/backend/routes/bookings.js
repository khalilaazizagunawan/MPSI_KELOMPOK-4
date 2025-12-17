const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/bookings - Get all bookings (admin only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status, search } = req.query;
        
        let sql = 'SELECT * FROM bookings';
        let params = [];
        let conditions = [];

        if (status && status !== 'all') {
            conditions.push('status = ?');
            params.push(status);
        }

        if (search) {
            conditions.push('(email LIKE ? OR name LIKE ? OR company LIKE ?)');
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY created_at DESC';

        const bookings = await dbAll(sql, params);

        // Get stats
        const stats = await dbGet(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Menunggu' THEN 1 ELSE 0 END) as waiting,
                SUM(CASE WHEN status = 'Terkonfirmasi' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as done
            FROM bookings
        `);

        res.json({
            success: true,
            data: bookings,
            stats: {
                total: stats.total || 0,
                waiting: stats.waiting || 0,
                confirmed: stats.confirmed || 0,
                done: stats.done || 0
            }
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await dbGet(
            'SELECT * FROM bookings WHERE id = ?',
            [req.params.id]
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST /api/bookings - Create new booking (public - from consultation form)
router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            company,
            position,
            whatsapp,
            service,
            message,
            booking_date,
            booking_time
        } = req.body;

        // Validation
        if (!name || !email || !company || !whatsapp || !service || !booking_date || !booking_time) {
            return res.status(400).json({
                success: false,
                message: 'Data wajib tidak lengkap'
            });
        }

        // Validasi nama harus huruf (boleh spasi, tidak boleh angka)
        const nameRegex = /^[a-zA-Z\s\u00C0-\u017F]+$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({
                success: false,
                message: 'Nama hanya boleh berisi huruf dan spasi'
            });
        }

        // Validasi email harus @gmail.com
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json({
                success: false,
                message: 'Email harus menggunakan @gmail.com'
            });
        }
        const emailRegex = /^[^\s@]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }

        // Validasi nomor WhatsApp harus angka dan depannya harus 62
        const waRegex = /^[0-9]+$/;
        if (!waRegex.test(whatsapp)) {
            return res.status(400).json({
                success: false,
                message: 'Nomor WhatsApp hanya boleh berisi angka'
            });
        }
        if (!whatsapp.startsWith('62')) {
            return res.status(400).json({
                success: false,
                message: 'Nomor WhatsApp harus diawali dengan 62'
            });
        }
        if (whatsapp.length < 10 || whatsapp.length > 15) {
            return res.status(400).json({
                success: false,
                message: 'Nomor WhatsApp harus antara 10-15 digit'
            });
        }

        // Insert booking
        const result = await dbRun(
            `INSERT INTO bookings (name, email, company, position, whatsapp, service, message, booking_date, booking_time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, company, position || '', whatsapp, service, message || '', booking_date, booking_time]
        );

        res.status(201).json({
            success: true,
            message: 'Permintaan konsultasi berhasil dikirim',
            data: {
                id: result.lastID,
                name,
                email,
                company,
                booking_date,
                booking_time,
                status: 'Menunggu'
            }
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// PUT /api/bookings/:id - Update booking status (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status wajib diisi'
            });
        }

        const validStatuses = ['Menunggu', 'Terkonfirmasi', 'Selesai', 'Dibatalkan'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid'
            });
        }

        const result = await dbRun(
            'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking tidak ditemukan'
            });
        }

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'UPDATE_BOOKING', `Updated booking #${id} status to ${status}`]
        );

        res.json({
            success: true,
            message: 'Status booking berhasil diperbarui'
        });
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// DELETE /api/bookings/:id - Delete booking (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await dbRun(
            'DELETE FROM bookings WHERE id = ?',
            [req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking tidak ditemukan'
            });
        }

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'DELETE_BOOKING', `Deleted booking #${req.params.id}`]
        );

        res.json({
            success: true,
            message: 'Booking berhasil dihapus'
        });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;

