const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { dbRun, dbGet, dbAll } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Setup multer for image upload
const uploadDir = path.join(__dirname, '../../public/doc');

// Create uploads directory if not exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Keep original filename or generate unique one
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `gallery_${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diizinkan'), false);
        }
    }
});

// GET /api/gallery - Get all gallery items (public)
router.get('/', async (req, res) => {
    try {
        const gallery = await dbAll(
            'SELECT * FROM gallery_items ORDER BY display_order ASC, id ASC'
        );

        res.json({
            success: true,
            data: gallery
        });
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET /api/gallery/:id - Get single gallery item
router.get('/:id', async (req, res) => {
    try {
        const item = await dbGet(
            'SELECT * FROM gallery_items WHERE id = ?',
            [req.params.id]
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error('Get gallery item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Ukuran file terlalu besar. Maksimal 10MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Upload error'
        });
    }
    next();
};

// POST /api/gallery - Create new gallery item (admin only)
router.post('/', authenticateToken, upload.single('image'), handleMulterError, async (req, res) => {
    try {
        console.log('POST /api/gallery - Request received');
        console.log('Body:', req.body);
        console.log('File:', req.file ? req.file.filename : 'No file');
        
        const { title, description, display_order } = req.body;
        const file = req.file;

        // Validation
        if (!title || !title.trim()) {
            if (file && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Judul wajib diisi'
            });
        }

        let imagePath = '';

        if (file) {
            imagePath = '/public/doc/' + file.filename;
            console.log('Image path:', imagePath);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Gambar wajib diupload'
            });
        }

        let result;
        try {
            console.log('Inserting to database...');
            result = await dbRun(
                `INSERT INTO gallery_items (image_path, title, description, display_order)
                 VALUES (?, ?, ?, ?)`,
                [imagePath, title, description || '', parseInt(display_order) || 0]
            );
            console.log('Insert result:', result);
        } catch (dbError) {
            console.error('Database error:', dbError);
            console.error('Database error stack:', dbError.stack);
            if (file && fs.existsSync(file.path)) {
                try {
                    fs.unlinkSync(file.path);
                } catch (unlinkErr) {
                    console.error('Error deleting file:', unlinkErr);
                }
            }
            return res.status(500).json({
                success: false,
                message: `Database error: ${dbError.message}`
            });
        }

        // Log activity (non-blocking)
        try {
            await dbRun(
                'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
                [req.user.id, 'CREATE_GALLERY', `Menambah gallery item: ${title}`]
            );
        } catch (logError) {
            console.error('Error logging activity:', logError);
            // Continue even if logging fails
        }

        console.log('Gallery item created successfully, ID:', result.lastID);
        res.status(201).json({
            success: true,
            message: 'Gallery item berhasil ditambahkan',
            data: {
                id: result.lastID,
                image_path: imagePath,
                title,
                description
            }
        });
    } catch (error) {
        console.error('Create gallery item error:', error);
        console.error('Error stack:', error.stack);
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// PUT /api/gallery/:id - Update gallery item (admin only)
// Upload is optional for update
router.put('/:id', authenticateToken, upload.single('image'), (err, req, res, next) => {
    // Ignore multer errors if no file uploaded (optional for update)
    if (err && err.code !== 'LIMIT_FILE_SIZE') {
        return handleMulterError(err, req, res, next);
    }
    next();
}, async (req, res) => {
    try {
        const { title, description, display_order } = req.body;
        const { id } = req.params;
        const file = req.file;

        // Check if item exists
        const existing = await dbGet('SELECT * FROM gallery_items WHERE id = ?', [id]);
        if (!existing) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(404).json({
                success: false,
                message: 'Gallery item tidak ditemukan'
            });
        }

        let imagePath = existing.image_path;

        // If new image uploaded, delete old image and update
        if (file) {
            // Delete old image if exists
            if (existing.image_path) {
                const oldFilePath = path.join(__dirname, '../..', existing.image_path);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            
            imagePath = '/public/doc/' + file.filename;
        }

        await dbRun(
            `UPDATE gallery_items 
             SET image_path = ?, title = ?, description = ?, display_order = ?
             WHERE id = ?`,
            [
                imagePath,
                title || existing.title,
                description !== undefined ? description : existing.description,
                display_order !== undefined ? parseInt(display_order) : existing.display_order,
                id
            ]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'UPDATE_GALLERY', `Mengubah gallery item: ${title || existing.title}`]
        );

        res.json({
            success: true,
            message: 'Gallery item berhasil diperbarui'
        });
    } catch (error) {
        console.error('Update gallery item error:', error);
        console.error('Error stack:', error.stack);
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// DELETE /api/gallery/:id - Delete gallery item (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const item = await dbGet('SELECT * FROM gallery_items WHERE id = ?', [req.params.id]);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item tidak ditemukan'
            });
        }

        // Delete image file if exists
        if (item.image_path) {
            const filePath = path.join(__dirname, '../..', item.image_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const result = await dbRun(
            'DELETE FROM gallery_items WHERE id = ?',
            [req.params.id]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'DELETE_GALLERY', `Menghapus gallery item: ${item.title}`]
        );

        res.json({
            success: true,
            message: 'Gallery item berhasil dihapus'
        });
    } catch (error) {
        console.error('Delete gallery item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;

