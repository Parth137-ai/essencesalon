const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// GET all services
router.get('/', (req, res) => {
  db.all("SELECT * FROM services ORDER BY id ASC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
});

module.exports = router;
