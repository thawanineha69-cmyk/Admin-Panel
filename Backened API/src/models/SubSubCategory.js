const mongoose = require('mongoose');

const subSubCategorySchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true, 'Name is required'],
    match: /^[a-z A-Z]{2,15}$/,
  },
  parent_category_id : {
    type : String,
    required : [true, 'parent Category is required'],
    ref : 'categories'
  },
  sub_category_id : {
    type : String,
    required : [true, 'Sub Category is required'],
    ref : 'sub_categories'
  },
  image : {
    type : String,
    default : '',
    // required : true,
  },
  slug : {
    type : String,
    required : true,
  },
  status : {
    type : Boolean,
    default : true
  },
  order : {
    type : Number,
    default : 0
  },
  created_at : {
    type : Date,
    default : new Date()
  },
  updated_at : {
    type : Date,
    default : new Date()
  },
  deleted_at : {
    type : Date,
    default : ''
  },
});

subSubCategorySchema.path('name').validate(async function(value) {
  const query = {
    name: value,
    deleted_at: null
  };

  const currentId = (this.getQuery && this.getQuery()._id) || this._id;

  if (currentId) {
    query._id = { $ne: currentId };
  }

  const existing = await subSubCategoryModel.findOne(query);
  return !existing;
}, 'The specified name is already in use.');

const subSubCategoryModel = mongoose.model('sub_sub_categories', subSubCategorySchema);

module.exports = subSubCategoryModel;