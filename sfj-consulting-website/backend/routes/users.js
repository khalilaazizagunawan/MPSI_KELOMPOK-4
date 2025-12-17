const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { dbRun, dbGet, dbAll } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/users - Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await dbAll(
            'SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET /api/users/:id - Get single user (admin only)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await dbGet(
            'SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = ?',
            [req.params.id]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST /api/users - Create new user (admin only)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password wajib diisi'
            });
        }

        // Check if username exists
        const existing = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Username sudah digunakan'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await dbRun(
            `INSERT INTO users (username, password, email, role)
             VALUES (?, ?, ?, ?)`,
            [username, hashedPassword, email || '', role || 'admin']
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'CREATE_USER', `Created new user: ${username}`]
        );

        res.status(201).json({
            success: true,
            message: 'User berhasil dibuat',
            data: {
                id: result.lastID,
                username,
                email,
                role: role || 'admin'
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        const { id } = req.params;

        // Check if user exists
        const existing = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        // Check if new username is taken by another user
        if (username && username !== existing.username) {
            const taken = await dbGet('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
            if (taken) {
                return res.status(400).json({
                    success: false,
                    message: 'Username sudah digunakan'
                });
            }
        }

        // Hash password if provided, otherwise keep existing
        let finalPassword = existing.password;
        if (password) {
            finalPassword = await bcrypt.hash(password, 10);
        }

        await dbRun(
            `UPDATE users 
             SET username = ?, password = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                username || existing.username,
                finalPassword,
                email !== undefined ? email : existing.email,
                role || existing.role,
                id
            ]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'UPDATE_USER', `Updated user: ${username || existing.username}`]
        );

        res.json({
            success: true,
            message: 'User berhasil diperbarui'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        // Prevent self-deletion
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus akun sendiri'
            });
        }

        const user = await dbGet('SELECT username FROM users WHERE id = ?', [req.params.id]);
        
        const result = await dbRun(
            'DELETE FROM users WHERE id = ?',
            [req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'DELETE_USER', `Deleted user: ${user?.username || 'Unknown'}`]
        );

        res.json({
            success: true,
            message: 'User berhasil dihapus'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;

