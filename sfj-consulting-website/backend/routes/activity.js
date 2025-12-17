const express = require('express');
const router = express.Router();
const { dbAll } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/activity - Get activity logs (admin only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNum = parseInt(limit) || 50;
        
        const sql = `
            SELECT 
                al.id,
                al.action,
                al.description,
                al.created_at,
                u.username
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT ${limitNum}
        `;

        const logs = await dbAll(sql);

        // Format time for display
        const formattedLogs = logs.map(log => {
            const date = new Date(log.created_at);
            const timeStr = date.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            return {
                ...log,
                time_display: timeStr,
                display_text: `${log.username || 'System'}: ${log.description} (${timeStr})`
            };
        });

        res.json({
            success: true,
            data: formattedLogs
        });
    } catch (error) {
        console.error('Get activity logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
