const express = require('express');
const initializeDatabase = require('./src/db/init');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Initialize database
initializeDatabase();

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});