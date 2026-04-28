const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['abaya', 'shirt', 'dress', 'jacket', 'pants', 'top']
  },
  emoji: {
    type: String,
    default: '👗'
  },
  colors: [{ type: String }],
  sizes: {
    type: [String],
    default: ['XS', 'S', 'M', 'L', 'XL']
  },
  arOverlay: {
    type: {
      type: String,
      enum: ['dress', 'top', 'jacket', 'pants']
    },
    topRatio: Number,
    heightRatio: Number,
    widthRatio: Number,
    color: String
  },
  badge: {
    type: String,
    default: null
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);