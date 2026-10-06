const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        match: /^[a-zA-Z\s.'-]{2,50}$/,
    },

    designation: {
        type: String,
        required: [true, "Designation is required"],
        trim: true,
        match: /^[a-zA-Z\s.'-]{2,50}$/,
    },

    image: {
        type: String,
        required: [true, "Image is required"],
        trim: true,
    },

    description: {
        type: String,
        required: [true, "Testimonial is required"],
        trim: true,
        minlength: [10, "Testimonial must be at least 10 characters"],
        maxlength: [500, "Testimonial cannot exceed 500 characters"],
    },

    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
        validate: {
            validator: Number.isInteger,
            message: "Rating must be a whole number"
        }
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
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    },

    deleted_at: {
        type: Date,
        default: ''
    }

});

const testimonialModel = mongoose.model(
    "testimonials",
    testimonialSchema
);

module.exports = testimonialModel;