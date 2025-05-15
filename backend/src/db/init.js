const connection = require('./../config/database');

const initializeDatabase = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database');
        
        // Create users table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                userId INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(60) NOT NULL,
                type VARCHAR(50) NOT NULL,
                active BOOLEAN DEFAULT true
            )
        `;
        
        connection.query(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
                return;
            }
            console.log('Users table created or already exists');
            
            // Create stored procedure for adding users with hashed password
            const dropProcedure = 'DROP PROCEDURE IF EXISTS addUser;';
            const createProcedureBody = `
                CREATE PROCEDURE addUser(
                    IN p_email VARCHAR(255),
                    IN p_password VARCHAR(60),
                    IN p_type VARCHAR(50),
                    IN p_active BOOLEAN
                )
                BEGIN
                    INSERT INTO users (email, password, type, active)
                    VALUES (p_email, p_password, p_type, p_active);
                END;
            `;

            connection.query(dropProcedure, (err) => {
                if (err) {
                    console.error('Error dropping existing procedure:', err);
                    return;
                }
                
                connection.query(createProcedureBody, (err) => {
                    if (err) {
                        console.error('Error creating stored procedure:', err);
                        return;
                    }
                    console.log('Stored procedure created successfully');
                });
            });
        });
    });
};

module.exports = initializeDatabase; 