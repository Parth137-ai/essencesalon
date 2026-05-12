const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// --- Public Client Routes ---

// POST new booking
router.post('/', (req, res) => {
  const { full_name, phone, email, service, staff_pref, date_pref, time_slot, message } = req.body;

  if (!full_name || !phone || !service) {
    return res.status(400).json({ success: false, error: 'Name, phone and service are required.' });
  }

  const sql = `INSERT INTO bookings (full_name, phone, email, service, staff_pref, date_pref, time_slot, message)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [full_name, phone, email, service, staff_pref, date_pref, time_slot, message], function(err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({
      success: true,
      message: `Thank you ${full_name}! Your booking request has been received.`,
      booking_id: this.lastID
    });
  });
});

// --- Admin Routes (To be mounted under /api/admin/bookings) ---

// GET all bookings
router.get('/list', (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
});

// Update status
router.patch('/:id', (req, res) => {
  const { status } = req.body;
  db.run("UPDATE bookings SET status=? WHERE id=?", [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Booking #${req.params.id} updated to ${status}` });
  });
});

// Delete
router.delete('/:id', (req, res) => {
  db.run("DELETE FROM bookings WHERE id=?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Booking #${req.params.id} deleted` });
  });
});

module.exports = router;
