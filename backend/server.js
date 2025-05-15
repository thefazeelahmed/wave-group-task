const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const initializeDatabase = require('./src/db/init');
const userRoutes = require('./src/routes/user');
const uploadRoutes = require('./src/routes/media');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: false
}));

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../upload_images')));

// Ensure upload_images directory exists
const uploadDir = path.join(__dirname, '../upload_images');
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Created upload directory at ${uploadDir}`);
    } catch (err) {
        console.error('Failed to create upload directory:', err);
        process.exit(1);
    }
}


// Initialize database
initializeDatabase();

// Routes
app.use('/api/users', userRoutes);
app.use('/upload', uploadRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
