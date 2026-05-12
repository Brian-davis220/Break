const express = require('express');
const router = express.Router();
const db = require('../db');

// @route   GET /api/cars
// @desc    Get all cars
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM cars ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/cars/:id
// @desc    Get single car
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Car not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/cars
// @desc    Add a new car
router.post('/', async (req, res) => {
    const { make, model, year, color, price } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO cars (make, model, year, color, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [make, model, year, color, price]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/cars/:id
// @desc    Update a car
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { make, model, year, color, price } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE cars SET make = $1, model = $2, year = $3, color = $4, price = $5 WHERE id = $6 RETURNING *',
            [make, model, year, color, price, id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Car not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /api/cars/:id
// @desc    Delete a car
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await db.query('DELETE FROM cars WHERE id = $1', [id]);
        if (rowCount === 0) return res.status(404).json({ message: 'Car not found' });
        res.json({ message: 'Car deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
