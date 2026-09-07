const express = require('express');
const router = express.Router();
const db = require('../database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', verifyToken, isAdmin, (req, res) => {
  db.all('SELECT id, username, email, first_name, last_name, role, status, created_at FROM users', 
    (err, users) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(users);
    }
  );
});

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  db.get(
    'SELECT id, username, email, first_name, last_name, role, created_at FROM users WHERE id = ?',
    [req.userId],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    }
  );
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  const { first_name, last_name } = req.body;
  
  db.run(
    'UPDATE users SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [first_name, last_name, req.userId],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// Get user by ID
router.get('/:id', verifyToken, (req, res) => {
  db.get(
    'SELECT id, username, email, first_name, last_name, role, created_at FROM users WHERE id = ?',
    [req.params.id],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    }
  );
});

module.exports = router;
