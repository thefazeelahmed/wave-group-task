const bcrypt = require('bcrypt');
const connection = require('../config/database');

const SALT_ROUNDS = 10;

const addUser = async (req, res) => {
    try {
        const { email, password, type, active } = req.body;

        // Input validation
        if (!email || !password || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        // Store user with hashed password
        connection.query(
            'CALL addUser(?, ?, ?, ?)',
            [email, hashedPassword, type, active !== undefined ? active : true],
            (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: 'Email already exists' });
                    }
                    console.error('Error adding user:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.json({ message: 'User added successfully' });
            }
        );
    } catch (error) {
        console.error('Error in user creation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addUser
}; 