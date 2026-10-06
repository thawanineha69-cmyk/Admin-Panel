const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
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

subCategorySchema.path('name').validate(async function(value) {
  const query = {
    name: value,
    deleted_at: null
  };

  const currentId = (this.getQuery && this.getQuery()._id) || this._id;

  if (currentId) {
    query._id = { $ne: currentId };
  }

  const existing = await subCategoryModel.findOne(query);
  return !existing;
}, 'The specified name is already in use.');

const subCategoryModel = mongoose.model('sub_categories', subCategorySchema);

module.exports = subCategoryModel;