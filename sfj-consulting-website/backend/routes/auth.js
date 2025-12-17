const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { dbGet, dbRun } = require('../config/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password wajib diisi'
            });
        }

        // Find user
        const user = await dbGet(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }

        // Check password with bcrypt
        // Support both hashed and plain text passwords (for migration)
        let passwordMatch = false;
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
            // Password is hashed, use bcrypt compare
            passwordMatch = await bcrypt.compare(password, user.password);
        } else {
            // Plain text password (legacy), compare directly and hash it
            passwordMatch = user.password === password;
            if (passwordMatch) {
                // Hash the password and update in database
                const hashedPassword = await bcrypt.hash(password, 10);
                await dbRun(
                    'UPDATE users SET password = ? WHERE id = ?',
                    [hashedPassword, user.id]
                );
            }
        }

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }

        // Generate token
        const token = generateToken(user);

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [user.id, 'LOGIN', `${user.username} logged in`]
        );

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'LOGOUT', `${req.user.username} logged out`]
        );

        res.json({
            success: true,
            message: 'Logout berhasil'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET /api/auth/verify - Verify token
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token valid',
        data: req.user
    });
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await dbGet(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
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

module.exports = router;

