const express = require('express');
const router = express.Router();
const db = require('../database');
const { verifyToken } = require('../middleware/auth');

// Create order
router.post('/', verifyToken, (req, res) => {
  const { items, shipping_address, payment_method } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items' });
  }

  let totalAmount = 0;
  let itemsProcessed = 0;

  db.run('BEGIN TRANSACTION', (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Insert order
    db.run(
      `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) 
       VALUES (?, ?, ?, ?)`,
      [req.userId, 0, shipping_address, payment_method],
      function(orderId) {
        const newOrderId = this.lastID;

        // Insert order items
        items.forEach(item => {
          db.get('SELECT price FROM products WHERE id = ?', [item.product_id], (err, product) => {
            if (product) {
              const itemTotal = product.price * item.quantity;
              totalAmount += itemTotal;

              db.run(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES (?, ?, ?, ?)`,
                [newOrderId, item.product_id, item.quantity, product.price],
                (err) => {
                  itemsProcessed++;
                  if (itemsProcessed === items.length) {
                    // Update order total
                    db.run(
                      'UPDATE orders SET total_amount = ? WHERE id = ?',
                      [totalAmount, newOrderId],
                      (err) => {
                        db.run('COMMIT', (err) => {
                          res.json({ message: 'Order created', orderId: newOrderId, totalAmount });
                        });
                      }
                    );
                  }
                }
              );
            }
          });
        });
      }
    );
  });
});

// Get user orders
router.get('/', verifyToken, (req, res) => {
  db.all(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [req.userId],
    (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(orders);
    }
  );
});

// Get order details
router.get('/:id', verifyToken, (req, res) => {
  db.get(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    (err, order) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!order) return res.status(404).json({ error: 'Order not found' });

      db.all(
        'SELECT * FROM order_items WHERE order_id = ?',
        [req.params.id],
        (err, items) => {
          res.json({ ...order, items });
        }
      );
    }
  );
});

module.exports = router;
