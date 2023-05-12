const mongoose = require('mongoose');

const CategorieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: false,
    }
}, {timestamps: true});

const CategorieModel = mongoose.model('Categorie', CategorieSchema)
module.exports = CategorieModel;