const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../essence_salon.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database Connection Error:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

const initializeDatabase = () => {
  db.serialize(() => {
    // Bookings table
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

    seedData();
  });
};

const seedData = () => {
  // Seed Staff
  db.get("SELECT COUNT(*) as cnt FROM staff", (err, row) => {
    if (row && row.cnt === 0) {
      const stmt = db.prepare(`INSERT INTO staff (name, role, experience, specialty, phone, is_head) VALUES (?,?,?,?,?,?)`);
      const staff = [
        ['Vipul Valand', 'Co-Founder & Head Stylist', '20+ Years', 'Master Hair Styling, Advanced Colour, Men & Women Cuts', '9909706587', 1],
        ['Bhavesh Sharma', 'Co-Founder & Beauty Director', '22+ Years', 'Bridal Makeovers, Skin Treatments, Unisex Styling, Spa Therapies', '9909706587', 1],
        ['Mahesh Valand', "Men's Specialist", '15+ Years', "Men's Haircut, Beard Grooming, Shave, Hair Spa", null, 0],
        ['Dharti', "Women's Specialist", '5+ Years', "Ladies Haircut, Facial, Waxing, Bridal Prep, Mehandi", null, 0],
        ['Ankit Sharma', "Men's Specialist", '8+ Years', "Men's Cut, Beard Art, Colour, Hair Treatments", null, 0]
      ];
      staff.forEach(s => stmt.run(...s));
      stmt.finalize();
      console.log('✅ Staff data seeded');
    }
  });

  // Seed Services
  db.get("SELECT COUNT(*) as cnt FROM services", (err, row) => {
    if (row && row.cnt === 0) {
      const stmt = db.prepare(`INSERT INTO services (name, description, price_from, price_upto, category, gender) VALUES (?,?,?,?,?,?)`);
      const services = [
        ['Haircut & Styling', 'Precision cuts and styling.', 500, 1200, 'Hair', 'unisex'],
        ['Hair Color & Highlights', 'Advanced color techniques.', 2500, null, 'Hair', 'unisex'],
        ['Beard & Shave', 'Classic grooming for men.', 300, null, 'Men', 'men'],
        ['Hair Spa & Keratin', 'Deep conditioning treatments.', 500, 1000, 'Hair', 'unisex'],
        ['Facial & Skin Care', 'Brightening and anti-aging.', 1000, 4000, 'Skin', 'unisex'],
        ['Waxing & Threading', 'Precision body grooming.', 700, 2000, 'Body', 'women'],
        ['Nail Studio', 'Manicure and nail art.', 300, 1000, 'Nails', 'unisex'],
        ['Bridal Packages', 'Complete bridal beauty.', 10000, 20000, 'Bridal', 'women']
      ];
      services.forEach(s => stmt.run(...s));
      stmt.finalize();
      console.log('✅ Services data seeded');
    }
  });
};

module.exports = { db, initializeDatabase };
