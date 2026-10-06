const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true, 'Name is required'],
    match: /^[a-z A-Z]{2,15}$/,
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

categorySchema.path('name').validate(async function(value) {
  const query = {
    name: value,
    deleted_at: null
  };

  const currentId = (this.getQuery && this.getQuery()._id) || this._id;

  if (currentId) {
    query._id = { $ne: currentId };
  }

  const existing = await categoryModel.findOne(query);
  return !existing;
}, 'The specified name is already in use.');

const categoryModel = mongoose.model('categories', categorySchema);

module.exports = categoryModel;