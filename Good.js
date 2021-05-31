const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const goodSchema = new Schema({
    title: String,
    price: Number,
    about: String,
    photo: String,
    category: [String],
    dateOfPlacement: String,
    dateOfSale: String,
    login: String,
    password: String
})

const Good = mongoose.model('Good', goodSchema);

module.exports = Good;