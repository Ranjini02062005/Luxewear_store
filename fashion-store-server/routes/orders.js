const router = require('express').Router();
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// POST /api/orders — Place order
router.post('/', authMiddleware, async (req, res) => {
  const { address } = req.body;

  try {
    // 1. Get cart items
    const [cartItems] = await db.query(
      `SELECT c.id as cart_id, c.quantity,
              p.id as product_id, p.name,
              p.price, p.stock
       FROM cart c
       INNER JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    console.log('Cart items found:', cartItems.length);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // 2. Check stock for each item
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          message: `Sorry, only ${item.stock} units of "${item.name}" available`
        });
      }
    }

    // 3. Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);

    console.log('Order total:', total);

    // 4. Create order record
    const [orderResult] = await db.query(
      `INSERT INTO orders (user_id, total, address, status) VALUES (?, ?, ?, 'pending')`,
      [req.user.id, total.toFixed(2), address || null]
    );

    const orderId = orderResult.insertId;
    console.log('Order created with ID:', orderId);

    // 5. Insert order items one by one
    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
      // 6. Reduce stock
      await db.query(
        `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        [item.quantity, item.product_id, item.quantity]
      );
    }

    // 7. Clear cart
    await db.query(`DELETE FROM cart WHERE user_id = ?`, [req.user.id]);

    console.log('Order placed successfully:', orderId);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: orderId,
      total: total.toFixed(2)
    });

  } catch (err) {
    console.error('ORDER ERROR DETAILS:', err);
    return res.status(500).json({
      message: 'Order failed',
      error: err.message,
      sqlMessage: err.sqlMessage || null
    });
  }
});

// GET /api/orders — Get all orders for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.id, oi.quantity, oi.price,
                p.id as product_id, p.name, p.image_url
         FROM order_items oi
         INNER JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items || [];
    }

    return res.json(orders);

  } catch (err) {
    console.error('GET ORDERS ERROR:', err);
    return res.status(500).json({
      message: 'Could not fetch orders',
      error: err.message
    });
  }
});

module.exports = router;