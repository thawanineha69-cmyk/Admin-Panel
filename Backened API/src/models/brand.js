const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        match: /^[a-zA-Z0-9 '&.-]{2,50}$/,
        validate: {
            validator: async function (v) {

                let currentId = null;

                // Create ke time
                if (this instanceof mongoose.Query) {
                    // Update ke time
                    currentId = this.getQuery()._id;
                } else {
                    // Create ke time document ka _id
                    currentId = this._id;
                }

                const query = {
                    name: v,
                    deleted_at: null
                };

                // Current record ko duplicate check se exclude karo
                if (currentId) {
                    query._id = { $ne: currentId };
                }

                const check = await mongoose
                    .model('brands')
                    .findOne(query);

                return !check;
            },

            message: props => `The specified name is already in use.`
        }
    },

    slug: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
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
    }

});

const brandModel = mongoose.model('brands', brandSchema);

module.exports = brandModel;