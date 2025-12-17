const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/reviews - Get all reviews
router.get('/', async (req, res) => {
    try {
        const { status, admin } = req.query;
        
        let sql = 'SELECT * FROM reviews';
        let params = [];

        // If not admin request, only show visible reviews
        if (!admin) {
            sql += ' WHERE status = ?';
            params.push('Tampil');
        } else if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        const reviews = await dbAll(sql, params);

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET /api/reviews/:id - Get single review
router.get('/:id', async (req, res) => {
    try {
        const review = await dbGet(
            'SELECT * FROM reviews WHERE id = ?',
            [req.params.id]
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Ulasan tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Get review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST /api/reviews - Create new review (public)
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, is_anonymous, comment } = req.body;

        // Validation - comment is always required
        if (!comment || comment.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Komentar wajib diisi'
            });
        }

        // If not anonymous, first_name and last_name are required
        if (!is_anonymous) {
            if (!first_name || first_name.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'First Name wajib diisi'
                });
            }
            if (!last_name || last_name.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Last Name wajib diisi'
                });
            }
        }

        const result = await dbRun(
            `INSERT INTO reviews (first_name, last_name, is_anonymous, comment, status)
             VALUES (?, ?, ?, ?, ?)`,
            [
                is_anonymous ? 'Anonim' : (first_name || 'Anonim'),
                is_anonymous ? '' : (last_name || ''),
                is_anonymous ? 1 : 0,
                comment.trim(),
                'Tampil'
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Ulasan berhasil dikirim',
            data: {
                id: result.lastID,
                first_name: is_anonymous ? 'Anonim' : first_name,
                comment
            }
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// PUT /api/reviews/:id - Update review (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { status, comment } = req.body;
        const { id } = req.params;

        // Check if review exists
        const existing = await dbGet('SELECT * FROM reviews WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Ulasan tidak ditemukan'
            });
        }

        const validStatuses = ['Tampil', 'Disembunyikan'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid'
            });
        }

        const result = await dbRun(
            `UPDATE reviews 
             SET status = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                status || existing.status,
                comment !== undefined ? comment : existing.comment,
                id
            ]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'UPDATE_REVIEW', `Updated review #${id} status to ${status || existing.status}`]
        );

        res.json({
            success: true,
            message: 'Ulasan berhasil diperbarui'
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// PUT /api/reviews/:id/toggle - Toggle review visibility (admin only)
router.put('/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await dbGet('SELECT * FROM reviews WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Ulasan tidak ditemukan'
            });
        }

        const newStatus = existing.status === 'Tampil' ? 'Disembunyikan' : 'Tampil';

        await dbRun(
            'UPDATE reviews SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [newStatus, id]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'TOGGLE_REVIEW', `Toggled review #${id} to ${newStatus}`]
        );

        res.json({
            success: true,
            message: `Ulasan berhasil ${newStatus === 'Tampil' ? 'ditampilkan' : 'disembunyikan'}`,
            data: { status: newStatus }
        });
    } catch (error) {
        console.error('Toggle review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// DELETE /api/reviews/:id - Delete review (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await dbRun(
            'DELETE FROM reviews WHERE id = ?',
            [req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ulasan tidak ditemukan'
            });
        }

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'DELETE_REVIEW', `Deleted review #${req.params.id}`]
        );

        res.json({
            success: true,
            message: 'Ulasan berhasil dihapus'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;

