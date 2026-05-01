const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect, adminOnly } = require('../middleware/auth');

// Get profile
router.get('/profile', protect, async (req, res) => {
  res.json({ user: req.user });
});

// Update profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const allowed = ['name', 'avatar'];
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true
    });

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
});

// Toggle wishlist
router.post('/wishlist/:productId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    const idx = user.wishlist.indexOf(pid);

    if (idx === -1) {
      user.wishlist.push(pid);
    } else {
      user.wishlist.splice(idx, 1);
    }

    await user.save();
    res.json({
      message: idx === -1 ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;