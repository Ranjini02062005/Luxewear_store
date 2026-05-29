const router = require('express').Router();
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET /api/products?category=Men&sub_category=Kids&search=shirt
router.get('/', async (req, res) => {
  try {
    const { category, sub_category, search } = req.query;

    let query  = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (sub_category && sub_category !== 'All') {
      query += ' AND sub_category = ?';
      params.push(sub_category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR sub_category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (err) {
    console.error('Products error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/sub-categories?category=Men
// Returns list of sub_categories for a given category
router.get('/sub-categories', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT DISTINCT sub_category FROM products WHERE sub_category IS NOT NULL';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY sub_category';
    const [rows] = await db.query(query, params);
    const subCats = rows.map(r => r.sub_category).filter(Boolean);
    res.json(subCats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [[product]] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST — admin only
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, category, sub_category, image_url, stock } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, category, sub_category, image_url, stock) VALUES (?,?,?,?,?,?,?)',
      [name, description, price, category, sub_category || category, image_url, stock]
    );
    res.status(201).json({ message: 'Product added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT — admin only
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, category, sub_category, image_url, stock } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, description=?, price=?, category=?, sub_category=?, image_url=?, stock=? WHERE id=?',
      [name, description, price, category, sub_category, image_url, stock, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE — admin only
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;