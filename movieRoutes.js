const express = require('express');
const db = require('../utils/db');
const router = express.Router();

// Get all movies
router.get('/', (req, res) => {
    db.query('SELECT * FROM movies', (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching movies' });
        }
        res.status(200).json(result);
    });
});

// Get movie details by ID
router.get('/:id', (req, res) => {
    const movieId = req.params.id;
    db.query('SELECT * FROM movies WHERE id = ?', [movieId], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(result[0]);
    });
});

module.exports = router;
