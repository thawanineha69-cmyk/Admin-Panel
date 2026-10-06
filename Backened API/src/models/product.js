const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    match: /^[a-z A-Z]{2,15}$/,
  },

  slug: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    default: '',
  },

  parent_category_id: {
    type: String,
    required: [true, 'Parent Category is required'],
    ref: 'categories'
  },

  sub_category_id: {
    type: String,
    required: [true, 'Sub Category is required'],
    ref: 'sub_categories'
  },

  sub_sub_category_id: {
    type: String,
    required: [true, 'Sub Sub Category is required'],
    ref: 'sub_sub_categories'
  },

  color_ids: {
    type: Array,
    required: [true, 'Color is required'],
    ref: 'colors'
  },

  material_ids: {
    type: Array,
    required: [true, 'Material is required'],
    ref: 'materials'
  },

  actual_price: {
    type: Number,
    required: [true, 'Actual price is required'],
  },

  sale_price: {
    type: Number,
    required: [true, 'Sale price is required'],
  },

  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
  },

  is_featured: {
    type: Boolean,
    default: true,
  },

  status: {
    type: Boolean,
    default: true,
  },

  order: {
    type: Number,
    default: 0
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date,
    default: Date.now
  },

  deleted_at: {
    type: Date,
    default: ''
  },

});

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;