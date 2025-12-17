const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { dbRun, dbGet, dbAll } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Setup multer for image upload
const uploadDir = path.join(__dirname, '../../public/team');

// Create uploads directory if not exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `team_${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diizinkan'), false);
        }
    }
});

// GET /api/team - Get all team members (public)
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        
        let sql = 'SELECT * FROM team_members';
        let params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY id ASC';

        const members = await dbAll(sql, params);

        res.json({
            success: true,
            data: members
        });
    } catch (error) {
        console.error('Get team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET /api/team/:id - Get single team member
router.get('/:id', async (req, res) => {
    try {
        const member = await dbGet(
            'SELECT * FROM team_members WHERE id = ?',
            [req.params.id]
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tim tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: member
        });
    } catch (error) {
        console.error('Get team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST /api/team - Create new team member (admin only)
router.post('/', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
        const { name, position, description, quote, status } = req.body;
        const file = req.file;

        // Validation - all fields required
        if (!name || !position || !description || !quote) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi (Nama, Posisi, Deskripsi, Quote)'
            });
        }

        // Validate photo is required for new member
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'Foto wajib diupload'
            });
        }

        // Validasi nama harus huruf (boleh spasi, tidak boleh angka)
        const nameRegex = /^[a-zA-Z\s\u00C0-\u017F]+$/;
        if (!nameRegex.test(name)) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Nama hanya boleh berisi huruf dan spasi'
            });
        }

        let avatarPath = '/public/team/' + file.filename;

        const result = await dbRun(
            `INSERT INTO team_members (name, position, description, avatar, quote, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [name, position, description || '', avatarPath, quote || '', status || 'Aktif']
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'CREATE_TEAM', `Added new team member: ${name}`]
        );

        res.status(201).json({
            success: true,
            message: 'Anggota tim berhasil ditambahkan',
            data: {
                id: result.lastID,
                name,
                position,
                description,
                status: status || 'Aktif'
            }
        });
    } catch (error) {
        console.error('Create team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// PUT /api/team/:id - Update team member (admin only)
router.put('/:id', authenticateToken, upload.single('photo'), async (req, res) => {
    try {
        const { name, position, description, quote, status } = req.body;
        const { id } = req.params;
        const file = req.file;

        // Check if member exists
        const existing = await dbGet('SELECT * FROM team_members WHERE id = ?', [id]);
        if (!existing) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(404).json({
                success: false,
                message: 'Anggota tim tidak ditemukan'
            });
        }

        // Get final values (use existing if not provided)
        const finalName = name || existing.name;
        const finalPosition = position || existing.position;
        const finalDescription = description !== undefined ? description : existing.description;
        const finalQuote = quote !== undefined ? quote : existing.quote;

        // Validation - all fields required
        if (!finalName || !finalPosition || !finalDescription || !finalQuote) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi (Nama, Posisi, Deskripsi, Quote)'
            });
        }

        // Validasi nama harus huruf
        const nameRegex = /^[a-zA-Z\s\u00C0-\u017F]+$/;
        if (!nameRegex.test(finalName)) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Nama hanya boleh berisi huruf dan spasi'
            });
        }

        let avatarPath = existing.avatar;

        // If new photo uploaded, delete old photo and update
        if (file) {
            // Delete old photo if exists
            if (existing.avatar) {
                const oldFilePath = path.join(__dirname, '../..', existing.avatar);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            
            avatarPath = '/public/team/' + file.filename;
        }

        const result = await dbRun(
            `UPDATE team_members 
             SET name = ?, position = ?, description = ?, avatar = ?, quote = ?, status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                finalName,
                finalPosition,
                finalDescription,
                avatarPath,
                finalQuote,
                status || existing.status,
                id
            ]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'UPDATE_TEAM', `Updated team member: ${finalName}`]
        );

        res.json({
            success: true,
            message: 'Anggota tim berhasil diperbarui'
        });
    } catch (error) {
        console.error('Update team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// DELETE /api/team/:id - Delete team member (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const member = await dbGet('SELECT name, avatar FROM team_members WHERE id = ?', [req.params.id]);
        
        // Delete photo if exists
        if (member && member.avatar) {
            const filePath = path.join(__dirname, '../..', member.avatar);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        const result = await dbRun(
            'DELETE FROM team_members WHERE id = ?',
            [req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Anggota tim tidak ditemukan'
            });
        }

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'DELETE_TEAM', `Deleted team member: ${member?.name || 'Unknown'}`]
        );

        res.json({
            success: true,
            message: 'Anggota tim berhasil dihapus'
        });
    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;

