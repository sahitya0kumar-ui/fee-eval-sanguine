/* ==========================================================================
   storage.js — Local Storage data layer for Sanguine
   Every "table" is a JSON array under its own key. seedIfEmpty() populates
   demo data on first load so the UI never looks empty.
   ========================================================================== */

const DB = {
  KEYS: {
    DONORS: 'bc_donors',
    REQUESTS: 'bc_requests',
    CAMPS: 'bc_camps',
    BANKS: 'bc_banks',
    USER: 'bc_current_user',
    USERS: 'bc_users',
    PREFS: 'bc_prefs'
  },

  read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('DB read failed for', key, e);
      return null;
    }
  },

  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('DB write failed for', key, e);
      return false;
    }
  },

  all(key) { return this.read(key) || []; },

  insert(key, record) {
    const rows = this.all(key);
    record.id = record.id || `${key}_${Date.now()}_${Math.floor(Math.random() * 999)}`;
    record.createdAt = record.createdAt || new Date().toISOString();
    rows.unshift(record);
    this.write(key, rows);
    return record;
  },

  update(key, id, patch) {
    const rows = this.all(key).map(r => (r.id === id ? { ...r, ...patch } : r));
    this.write(key, rows);
  },

  remove(key, id) {
    const rows = this.all(key).filter(r => r.id !== id);
    this.write(key, rows);
  },

  seedIfEmpty() {
    if (!this.read(this.KEYS.DONORS)) {
      const cities = ['Chandigarh', 'Mohali', 'Delhi', 'Mumbai', 'Pune', 'Bengaluru'];
      const groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
      const names = ['Aarav Sharma', 'Isha Verma', 'Rohan Mehta', 'Priya Nair', 'Karan Singh',
        'Ananya Gupta', 'Vikram Rao', 'Sneha Kapoor', 'Aditya Joshi', 'Meera Iyer',
        'Farhan Khan', 'Neha Reddy'];
      const donors = names.map((name, i) => ({
        id: `seed_donor_${i}`,
        name,
        age: 20 + (i % 15),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        bloodGroup: groups[i % groups.length],
        weight: 55 + (i % 20),
        phone: `9${(800000000 + i * 1234).toString().slice(0, 9)}`,
        email: `${name.split(' ')[0].toLowerCase()}@example.com`,
        city: cities[i % cities.length],
        lastDonation: i % 3 === 0 ? '2025-11-02' : '2026-05-14',
        available: i % 4 !== 0,
        donationsCount: (i * 3) % 12,
        createdAt: new Date().toISOString()
      }));
      this.write(this.KEYS.DONORS, donors);
    }

    if (!this.read(this.KEYS.BANKS)) {
      this.write(this.KEYS.BANKS, [
        { id: 'bank_1', name: 'City Life Blood Bank', address: 'Sector 34, Chandigarh', phone: '0172-2345678', hours: '24/7 Emergency', groups: ['O+', 'O-', 'A+', 'B+', 'AB+'] },
        { id: 'bank_2', name: 'Red Cross Blood Centre', address: 'Phase 7, Mohali', phone: '0172-3456789', hours: '8:00 AM – 8:00 PM', groups: ['O+', 'A-', 'B-', 'AB-'] },
        { id: 'bank_3', name: 'Fortis Blood Bank', address: 'Sector 62, Mohali', phone: '0172-4567890', hours: '24/7 Emergency', groups: ['O-', 'A+', 'B+', 'AB+', 'AB-'] },
        { id: 'bank_4', name: 'Government Hospital Blood Bank', address: 'Sector 16, Chandigarh', phone: '0172-5678901', hours: '9:00 AM – 6:00 PM', groups: ['O+', 'A+', 'B+'] }
      ]);
    }

    if (!this.read(this.KEYS.CAMPS)) {
      this.write(this.KEYS.CAMPS, [
        { id: 'camp_1', title: 'Corporate Donor Drive', date: '2026-08-22', venue: 'Tech Park, Mohali', organizer: 'Sanguine x TechPark', seats: 60, registered: 41 },
        { id: 'camp_2', title: 'University Blood Camp', date: '2026-09-05', venue: 'Panjab University Ground', organizer: 'Rotary Club', seats: 120, registered: 88 },
        { id: 'camp_3', title: 'Community Health Drive', date: '2026-09-19', venue: 'Sector 21 Community Hall', organizer: 'City Life Blood Bank', seats: 80, registered: 30 }
      ]);
    }

    if (!this.read(this.KEYS.REQUESTS)) {
      this.write(this.KEYS.REQUESTS, [
        { id: 'req_1', patient: 'Ramesh Kumar', bloodGroup: 'B+', hospital: 'City Life Hospital', units: 2, contact: '9812345670', city: 'Chandigarh', urgency: 'Critical', createdAt: new Date().toISOString() },
        { id: 'req_2', patient: 'Simran Kaur', bloodGroup: 'O-', hospital: 'Fortis Mohali', units: 1, contact: '9876543210', city: 'Mohali', urgency: 'Moderate', createdAt: new Date().toISOString() }
      ]);
    }

    if (!this.read(this.KEYS.USERS)) {
      this.write(this.KEYS.USERS, [
        { id: 'user_demo', name: 'Demo Donor', email: 'demo@sanguine.app', password: 'demo1234', role: 'donor' }
      ]);
    }
  },

  stats() {
    const donors = this.all(this.KEYS.DONORS);
    const requests = this.all(this.KEYS.REQUESTS);
    const banks = this.all(this.KEYS.BANKS);
    const camps = this.all(this.KEYS.CAMPS);
    return {
      totalDonors: donors.length,
      availableDonors: donors.filter(d => d.available).length,
      totalRequests: requests.length,
      totalBanks: banks.length,
      upcomingCamps: camps.length,
      unitsAvailable: donors.filter(d => d.available).length * 1 + 120
    };
  }
};

DB.seedIfEmpty();
