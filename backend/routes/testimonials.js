const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// GET approved testimonials
router.get('/', (req, res) => {
  db.all("SELECT * FROM testimonials WHERE approved=1 ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
});

module.exports = router;
