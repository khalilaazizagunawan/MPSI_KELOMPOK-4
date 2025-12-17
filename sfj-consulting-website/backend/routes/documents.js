const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { dbRun, dbGet, dbAll } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Setup multer for file upload
const uploadDir = path.join(__dirname, '../../uploads/documents');

// Create uploads directory if not exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: function (req, file, cb) {
        // Allow common document types
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain',
            'application/zip',
            'application/x-rar-compressed'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipe file tidak diizinkan'), false);
        }
    }
});

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// GET /api/documents - Get all documents
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        
        let sql = 'SELECT * FROM documents';
        let params = [];

        if (category) {
            sql += ' WHERE category = ?';
            params.push(category);
        }

        sql += ' ORDER BY created_at DESC';

        const documents = await dbAll(sql, params);

        res.json({
            success: true,
            data: documents
        });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET /api/documents/:id - Get single document
router.get('/:id', async (req, res) => {
    try {
        const document = await dbGet(
            'SELECT * FROM documents WHERE id = ?',
            [req.params.id]
        );

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST /api/documents - Create new document with file upload (admin only)
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        const { title, category, description } = req.body;
        const file = req.file;

        // Validation
        if (!title || !category || !description) {
            // Delete uploaded file if validation fails
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Judul, kategori, dan deskripsi wajib diisi'
            });
        }

        // Validate image is required for new document
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'Gambar wajib diupload'
            });
        }

        let filename = '';
        let filepath = '';
        let filesize = '';

        if (file) {
            filename = file.originalname;
            filepath = '/uploads/documents/' + file.filename;
            filesize = formatFileSize(file.size);
        }

        const result = await dbRun(
            `INSERT INTO documents (title, category, description, filename, filepath, filesize)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, category, description || '', filename, filepath, filesize]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'CREATE_DOCUMENT', `Menambah dokumen: ${title}`]
        );

        res.status(201).json({
            success: true,
            message: 'Dokumen berhasil ditambahkan',
            data: {
                id: result.lastID,
                title,
                category,
                description,
                filename,
                filepath,
                filesize
            }
        });
    } catch (error) {
        console.error('Create document error:', error);
        // Delete uploaded file if error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// PUT /api/documents/:id - Update document (admin only)
router.put('/:id', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        const { title, category, description } = req.body;
        const { id } = req.params;
        const file = req.file;

        // Check if document exists
        const existing = await dbGet('SELECT * FROM documents WHERE id = ?', [id]);
        if (!existing) {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan'
            });
        }

        // Validation - description is required
        const finalDescription = description !== undefined ? description : existing.description;
        if (!finalDescription || finalDescription.trim() === '') {
            if (file) {
                fs.unlinkSync(file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Deskripsi wajib diisi'
            });
        }

        let filename = existing.filename;
        let filepath = existing.filepath;
        let filesize = existing.filesize;

        // If new file uploaded, delete old file and update
        if (file) {
            // Delete old file if exists
            if (existing.filepath) {
                const oldFilePath = path.join(__dirname, '../..', existing.filepath);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            
            filename = file.originalname;
            filepath = '/uploads/documents/' + file.filename;
            filesize = formatFileSize(file.size);
        }

        await dbRun(
            `UPDATE documents 
             SET title = ?, category = ?, description = ?, filename = ?, filepath = ?, filesize = ?
             WHERE id = ?`,
            [
                title || existing.title,
                category || existing.category,
                description !== undefined ? description : existing.description,
                filename,
                filepath,
                filesize,
                id
            ]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'UPDATE_DOCUMENT', `Mengubah dokumen: ${title || existing.title}`]
        );

        res.json({
            success: true,
            message: 'Dokumen berhasil diperbarui'
        });
    } catch (error) {
        console.error('Update document error:', error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// DELETE /api/documents/:id - Delete document (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const document = await dbGet('SELECT * FROM documents WHERE id = ?', [req.params.id]);
        
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan'
            });
        }

        // Delete file if exists
        if (document.filepath) {
            const filePath = path.join(__dirname, '../..', document.filepath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const result = await dbRun(
            'DELETE FROM documents WHERE id = ?',
            [req.params.id]
        );

        // Log activity
        await dbRun(
            'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
            [req.user.id, 'DELETE_DOCUMENT', `Menghapus dokumen: ${document.title}`]
        );

        res.json({
            success: true,
            message: 'Dokumen berhasil dihapus'
        });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Download document
router.get('/:id/download', async (req, res) => {
    try {
        const document = await dbGet('SELECT * FROM documents WHERE id = ?', [req.params.id]);
        
        if (!document || !document.filepath) {
            return res.status(404).json({
                success: false,
                message: 'File tidak ditemukan'
            });
        }

        const filePath = path.join(__dirname, '../..', document.filepath);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File tidak ditemukan'
            });
        }

        res.download(filePath, document.filename);
    } catch (error) {
        console.error('Download document error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
