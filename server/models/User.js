// User.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true, select: false},
    balance: {type: Number, required: true}
});

module.exports = mongoose.model('User', userSchema);