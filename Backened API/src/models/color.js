const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    match: /^[a-z A-Z]{2,15}$/,
    validate: {
      validator: async function (v) {

        const query = {
          name: v,
          deleted_at: null
        };

        // Update ke time current record ko ignore karo
        if (this && typeof this.getQuery === "function") {
          const currentId = this.getQuery()._id;

          if (currentId) {
            query._id = { $ne: currentId };
          }
        }

        const check = await mongoose
          .model("colors")
          .findOne(query);

        return !check;
      },

      message: props => `The specified name is already in use.`
    }
  },
  code: {
      type: String,
      required: [true, 'Code is required'],
      match: /^[a-zA-Z0-9#]{2,15}$/,
    },
    slug: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    created_at: {
      type: Date,
      default: new Date()
    },
    updated_at: {
      type: Date,
      default: new Date()
    },
    deleted_at: {
      type: Date,
      default: ''
    },
  });

const colorModel = mongoose.model('colors', colorSchema);

module.exports = colorModel;