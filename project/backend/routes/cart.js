const router = require('express').Router();
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// Get cart items for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to cart
router.post('/', authMiddleware, async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  try {
    const [[existing]] = await db.query(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );
    if (existing) {
      await db.query('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing.id]);
    } else {
      await db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?)', [req.user.id, product_id, quantity]);
    }
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quantity
router.put('/:id', authMiddleware, async (req, res) => {
  const { quantity } = req.body;
  try {
    if (quantity <= 0) {
      await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    } else {
      await db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
    }
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from cart
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;