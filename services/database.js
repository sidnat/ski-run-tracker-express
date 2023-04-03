const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@passport-jwt.tr4phig.mongodb.net/?retryWrites=true&w=majority`);

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
}, {
    collection: 'users'
});

const runSchema = mongoose.Schema({
    userID: String,
    mountainName: String,
    trailName: String,
    runCounter: Number,
    date: Date,
    // bestRunTime: Number,
}, {
    collection: 'runs'
});
const UserModel = mongoose.model('User', userSchema);
const RunModel = mongoose.model("Run", runSchema);

module.exports = { UserModel, RunModel };