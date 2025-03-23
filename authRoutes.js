const express = require('express');
const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/jwtUtils');
const db = require('../utils/db');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if email already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.error('Database error while checking email:', err);
                return res.status(500).json({ message: 'Error checking email' });
            }

            if (result.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into database
            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Database error during registration:', err);
                    return res.status(500).json({ message: 'Error registering user' });
                }

                // Create JWT token
                const token = createToken({ id: result.insertId });

                // Respond with the token
                res.status(201).json({ token });
            });
        });
    } catch (error) {
        console.error('Error during registration:', error);  // Log the error
        res.status(500).json({ message: 'Internal server error' });
    }
});


// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (!result[0]) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const match = await bcrypt.compare(password, result[0].password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = createToken(result[0]);
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error processing login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
