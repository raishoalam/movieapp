const express = require('express');
const db = require('../utils/db');
const { decodeToken } = require('../utils/jwtUtils');
const router = express.Router();

// Add Review
router.post('/', (req, res) => {
    const { movieId, reviewText, rating } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = decodeToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = decoded.sub;
    db.query('INSERT INTO reviews (movie_id, user_id, review_text, rating) VALUES (?, ?, ?, ?)', 
    [movieId, userId, reviewText, rating], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding review' });
        }
        res.status(201).json({ message: 'Review added successfully' });
    });
});

// Edit Review
router.put('/:id', (req, res) => {
    const { reviewText, rating } = req.body;
    const reviewId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = decodeToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = decoded.sub;
    db.query('SELECT * FROM reviews WHERE id = ? AND user_id = ?', [reviewId, userId], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        db.query('UPDATE reviews SET review_text = ?, rating = ? WHERE id = ?', 
        [reviewText, rating, reviewId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating review' });
            }
            res.status(200).json({ message: 'Review updated successfully' });
        });
    });
});

// Delete Review
router.delete('/:id', (req, res) => {
    const reviewId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = decodeToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = decoded.sub;
    db.query('SELECT * FROM reviews WHERE id = ? AND user_id = ?', [reviewId, userId], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        db.query('DELETE FROM reviews WHERE id = ?', [reviewId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting review' });
            }
            res.status(200).json({ message: 'Review deleted successfully' });
        });
    });
});

module.exports = router;
