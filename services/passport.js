const passport = require('passport')
require('dotenv').config()

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const { UserModel } = require('./database')

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY; // robust secret string put in environment variables

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // console.log(jwt_payload)
    UserModel.findOne({id: jwt_payload.id}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));