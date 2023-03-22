const passport = require('passport')
// const JWTStrategy = require('passport-jwt').Strategy;
// const Extractors = require('passport-jwt').ExtractJwt;

// const options = {
//     secretOrKey: 'abc123keysecret',
//     jwtFromRequest: Extractors.fromAuthHeaderAsBearerToken
// }

// const verify = () => {
//     returns (null, {username: 'abc'})
// }

// passport.use(new JWTStrategy(options, verify))

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
const UserModel = require('./database')

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'Random string'; // robust secret string put in environment variables

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