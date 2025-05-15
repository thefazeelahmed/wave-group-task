const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});