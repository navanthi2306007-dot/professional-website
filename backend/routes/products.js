const express = require('express');
const router = express.Router();
const db = require('../database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all products
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM products WHERE status = "active"';
  let params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  db.all(query, params, (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
});

// Get product by ID
router.get('/:id', (req, res) => {
  db.get(
    'SELECT * FROM products WHERE id = ? AND status = "active"',
    [req.params.id],
    (err, product) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    }
  );
});

// Create product (admin only)
router.post('/', verifyToken, isAdmin, (req, res) => {
  const { name, description, price, category, stock, sku } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  db.run(
    `INSERT INTO products (name, description, price, category, stock, sku) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price, category, stock, sku],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product created', productId: this.lastID });
    }
  );
});

// Update product (admin only)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  const { name, description, price, category, stock } = req.body;

  db.run(
    `UPDATE products 
     SET name = ?, description = ?, price = ?, category = ?, stock = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [name, description, price, category, stock, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product updated' });
    }
  );
});

// Delete product (admin only)
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  db.run(
    'UPDATE products SET status = "inactive" WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product deleted' });
    }
  );
});

module.exports = router;
