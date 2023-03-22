const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect('mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@passport-jwt.tr4phig.mongodb.net/?retryWrites=true&w=majority');

const userSchema = mongoose.Schema({
    username: String,
    password: String
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;