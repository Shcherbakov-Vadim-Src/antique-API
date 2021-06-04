const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tokenSchema = new Schema({
    login: String,
    token: String
})

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;