const mongoose = require('mongoose');

const defaultSchema = new mongoose.Schema({
   title : {
     type : String,
     required : [true,'Title is required'],
     match : /^[a-zA-Z `0-9 ]{4,15}$/,
    //  validate : {
    //   validator : async function (v) {
    //     const check = await this.constructor.findOne({ title : v, deleted_at : null });
    //     return !check;
    //   },
    //   message : props => `This specified username is already in use.`
    //  }
    //  minLength : [5,'Minimum character length must be 5'],
    //  maxLength :[15,'Maximum character length must be 15']
   },
   slug : {
    type : String,
    required : true,
  },
   image : {
     type : String,
     required : true,
   },
   description : {
     type : String,
     default : '',
   },
   price : {
    type : Number,
    required : true,
    min : 100,
    max : 100000,
   },
   type :{
     type : String,
      required : true,
     enum : ['user','admin']
   },
   Status : {
     type : Boolean,
     default : true,
   },
   order : {
     type : Number,
     default : 0,
   },
   created_at : {
     type : Date,
     default : new Date(),
   },
   updated_at : {
     type : Date,
     default : new Date(),
   },
   deleted_at : {
     type : Date,
     default : null,
   },

});

const defaultModel = mongoose.model('defaults', defaultSchema);

module.exports = defaultModel;