const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database config
const { initDatabase } = require('./backend/config/database');

// Import routes
const authRoutes = require('./backend/routes/auth');
const bookingsRoutes = require('./backend/routes/bookings');
const teamRoutes = require('./backend/routes/team');
const reviewsRoutes = require('./backend/routes/reviews');
const usersRoutes = require('./backend/routes/users');
const activityRoutes = require('./backend/routes/activity');
const documentsRoutes = require('./backend/routes/documents');
const galleryRoutes = require('./backend/routes/gallery');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files: CSS, JS, images
app.use(express.static(__dirname));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/gallery', galleryRoutes);

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/konsultasi', (req, res) => {
    res.sendFile(path.join(__dirname, 'konsultasi.html'));
});

// Admin routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend_admin', 'admin.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend_admin', 'login.html'));
});

// API Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'SFJ Consulting API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Initialize database and start server
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log('=========================================');
            console.log('  SFJ Consulting Website - Backend API');
            console.log('=========================================');
            console.log(`Server running at http://localhost:${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api`);
            console.log('');
            console.log('Available API Endpoints:');
            console.log('  POST   /api/auth/login');
            console.log('  POST   /api/auth/logout');
            console.log('  GET    /api/auth/verify');
            console.log('  GET    /api/auth/me');
            console.log('');
            console.log('  GET    /api/bookings');
            console.log('  POST   /api/bookings');
            console.log('  PUT    /api/bookings/:id');
            console.log('  DELETE /api/bookings/:id');
            console.log('');
            console.log('  GET    /api/team');
            console.log('  POST   /api/team');
            console.log('  PUT    /api/team/:id');
            console.log('  DELETE /api/team/:id');
            console.log('');
            console.log('  GET    /api/reviews');
            console.log('  POST   /api/reviews');
            console.log('  PUT    /api/reviews/:id');
            console.log('  DELETE /api/reviews/:id');
            console.log('');
            console.log('  GET    /api/users');
            console.log('  POST   /api/users');
            console.log('  PUT    /api/users/:id');
            console.log('  DELETE /api/users/:id');
            console.log('');
            console.log('  GET    /api/activity');
            console.log('=========================================');
            console.log('Default Admin: username=admin, password=admin123');
            console.log('=========================================');
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });
