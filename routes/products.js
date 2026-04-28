const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET all products
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({ products, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
});

// GET single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// POST create product (admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    next(err);
  }
});

// PUT update product (admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    next(err);
  }
});

// DELETE product (admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
});

// Seed products
router.post('/seed/catalog', async (req, res, next) => {
  try {
    const catalog = require('../config/seedData');
    await Product.deleteMany({});
    const products = await Product.insertMany(catalog);
    res.json({ message: `Seeded ${products.length} products`, products });
  } catch (err) {
    next(err);
  }
});

module.exports = router;