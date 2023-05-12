const mongoose = require('mongoose');


//create a schema of product
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false,
    },
    image1: {
        type: String,
        required: true,
    },
    image2: {
        type: String,
        required: false,
    },
    image3: {
        type: String,
        required: false,
    },
    image4: {
        type: String,
        required: false,
    },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categorie",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'the quantity must be at least 0, got {VALUE}'],
    },
    price: {
        type: Number,
        required: true,
        default: 10.00,
        min: [0.0, 'the price must be at least 0, got {VALUE}'],
    },
}, {timestamps: true});

module.exports = mongoose.model('Product', ProductSchema);