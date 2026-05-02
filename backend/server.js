const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Database Setup ──────────────────────────────────────────
const db = new sqlite3.Database('./essence_salon.db', (err) => {
  if (err) { console.error('DB Error:', err.message); }
  else { console.log('✅ Connected to SQLite database'); }
});

// Create tables
db.serialize(() => {

  // Bookings / Inquiries table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name   TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT,
    service     TEXT NOT NULL,
    staff_pref  TEXT DEFAULT 'No Preference',
    date_pref   TEXT,
    time_slot   TEXT,
    message     TEXT,
    status      TEXT DEFAULT 'pending',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Staff table
  db.run(`CREATE TABLE IF NOT EXISTS staff (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    role       TEXT NOT NULL,
    experience TEXT NOT NULL,
    specialty  TEXT,
    phone      TEXT,
    is_head    INTEGER DEFAULT 0
  )`);

  // Services table
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    description TEXT,
    price_from  INTEGER,
    price_upto  INTEGER,
    category    TEXT,
    gender      TEXT DEFAULT 'unisex'
  )`);

  // Testimonials table
  db.run(`CREATE TABLE IF NOT EXISTS testimonials (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    client    TEXT NOT NULL,
    review    TEXT NOT NULL,
    rating    INTEGER DEFAULT 5,
    service   TEXT,
    approved  INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed staff data
  db.get("SELECT COUNT(*) as cnt FROM staff", (err, row) => {
    if (row.cnt === 0) {
      const staffInsert = db.prepare(`INSERT INTO staff (name, role, experience, specialty, phone, is_head) VALUES (?,?,?,?,?,?)`);
      staffInsert.run('Vipul Valand',   'Co-Founder & Head Stylist', '20+ Years', 'Master Hair Styling, Advanced Colour, Men & Women Cuts', '9909706587', 1);
      staffInsert.run('Bhavesh Sharma', 'Co-Founder & Beauty Director', '22+ Years', 'Bridal Makeovers, Skin Treatments, Unisex Styling, Spa Therapies', '9909706587', 1);
      staffInsert.run('Mahesh Valand',  "Men's Specialist", '15+ Years', "Men's Haircut, Beard Grooming, Shave, Hair Spa", null, 0);
      staffInsert.run('Dharti',         "Women's Specialist", '5+ Years', "Ladies Haircut, Facial, Waxing, Bridal Prep, Mehandi", null, 0);
      staffInsert.run('Ankit Sharma',   "Men's Specialist", '8+ Years', "Men's Cut, Beard Art, Colour, Hair Treatments", null, 0);
      staffInsert.finalize();
      console.log('✅ Staff seeded');
    }
  });

  // Seed services
  db.get("SELECT COUNT(*) as cnt FROM services", (err, row) => {
    if (row.cnt === 0) {
      const svc = db.prepare(`INSERT INTO services (name, description, price_from, price_upto, category, gender) VALUES (?,?,?,?,?,?)`);
      svc.run('Haircut & Styling',       'Precision cuts and styling for all hair types — classic to contemporary.',  500,   1200,  'Hair',   'unisex');
      svc.run('Hair Color & Highlights', 'Balayage, ombre, full colour, highlights with premium products.',           2500,  null,  'Hair',   'unisex');
      svc.run('Beard & Shave',           'Classic shave, beard trim, shape & grooming for men.',                      300,   null,  'Men',    'men');
      svc.run('Hair Spa & Keratin',      'Deep conditioning, keratin smoothing, scalp treatments & hair spa.',        500,   1000,  'Hair',   'unisex');
      svc.run('Facial & Skin Care',      'Classic, brightening, anti-aging & deep cleanse facials.',                  1000,  4000,  'Skin',   'unisex');
      svc.run('Waxing & Threading',      'Full body wax, eyebrow threading, upper lip, precision shaping.',           700,   2000,  'Body',   'women');
      svc.run('Nail Studio',             'Manicure, pedicure, gel nails, nail art & extensions.',                     300,   1000,  'Nails',  'unisex');
      svc.run('Bridal Packages',         'Complete bridal beauty — hair, makeup, skin prep & styling.',               10000, 20000, 'Bridal', 'women');
      svc.finalize();
      console.log('✅ Services seeded');
    }
  });

  // Seed testimonials
  db.get("SELECT COUNT(*) as cnt FROM testimonials", (err, row) => {
    if (row.cnt === 0) {
      const t = db.prepare(`INSERT INTO testimonials (client, review, rating, service) VALUES (?,?,?,?)`);
      t.run('Anita R., Thaltej',      'Vipul sir gave me the most amazing haircut — I look 5 years younger! The salon is so clean and welcoming. My go-to in Ahmedabad.',       5, 'Haircut & Styling');
      t.run('Raj P., Bopal',          'Mahesh bhai is the best for men\'s hair and beard styling. 15 years of experience really shows. Never going anywhere else.',             5, 'Beard & Shave');
      t.run('Priyanka S., Satellite', 'Dharti di did my pre-bridal facial and skin prep. My skin glowed on my wedding day. Essence Salon is truly exceptional.',               5, 'Bridal Packages');
      t.run('Kavya M., Thaltej',      'Bhavesh sir\'s balayage work is stunning. I showed him a reference and he exceeded it completely. Highly recommended!',                 5, 'Hair Color & Highlights');
      t.run('Neha D., Bodakdev',      'Ankit is brilliant with colour treatments. Got full highlights done and everyone keeps asking me where I got it done. Love this place!', 5, 'Hair Color & Highlights');
      t.finalize();
      console.log('✅ Testimonials seeded');
    }
  });
});

// ── API Routes ──────────────────────────────────────────────

// GET all staff
app.get('/api/staff', (req, res) => {
  db.all("SELECT * FROM staff ORDER BY is_head DESC, id ASC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
});

// GET all services
app.get('/api/services', (req, res) => {
  db.all("SELECT * FROM services ORDER BY id ASC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
});

// GET testimonials
app.get('/api/testimonials', (req, res) => {
  db.all("SELECT * FROM testimonials WHERE approved=1 ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
});

// POST new booking
app.post('/api/bookings', (req, res) => {
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
      message: `Thank you ${full_name}! Your booking request has been received. We'll call you at ${phone} to confirm.`,
      booking_id: this.lastID
    });
  });
});

// GET all bookings (admin)
app.get('/api/admin/bookings', (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows, total: rows.length });
  });
});

// PATCH booking status (admin)
app.patch('/api/admin/bookings/:id', (req, res) => {
  const { status } = req.body;
  db.run("UPDATE bookings SET status=? WHERE id=?", [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Booking #${req.params.id} updated to ${status}` });
  });
});

// DELETE booking (admin)
app.delete('/api/admin/bookings/:id', (req, res) => {
  db.run("DELETE FROM bookings WHERE id=?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `Booking #${req.params.id} deleted` });
  });
});

// GET dashboard stats (admin)
app.get('/api/admin/stats', (req, res) => {
  db.serialize(() => {
    const stats = {};
    db.get("SELECT COUNT(*) as total FROM bookings", (e, r) => { stats.total = r.total; });
    db.get("SELECT COUNT(*) as pending FROM bookings WHERE status='pending'", (e, r) => { stats.pending = r.pending; });
    db.get("SELECT COUNT(*) as confirmed FROM bookings WHERE status='confirmed'", (e, r) => { stats.confirmed = r.confirmed; });
    db.get("SELECT COUNT(*) as completed FROM bookings WHERE status='completed'", (e, r) => {
      stats.completed = r.completed;
      res.json({ success: true, data: stats });
    });
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌿 Essence Salon & Spa API running at http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`🌐 Website:     http://localhost:${PORT}\n`);
});
