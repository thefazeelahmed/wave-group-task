const express = require('express');
const initializeDatabase = require('./src/db/init');
require('dotenv').config();
const userRoutes = require('./src/routes/user');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Initialize database
initializeDatabase();


// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});