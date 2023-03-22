const express = require('express');
const app = express();
const cors = require('cors');
const { hashSync, compareSync } = require('bcrypt');
const UserModel = require('./config/database');
const jwt = require('jsonwebtoken');
const passport = require('passport');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(passport.initialize());

require('./config/passport')

app.post('/register', (req, res) => {
    const user = new UserModel({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })

    user.save().then(user => {
        res.send({
            success: true,
            message: "user created",
            user: {
                id: user._id,
                username: user.username
            }
        })
    }).catch(err => {
        res.send({
            success: false,
            message: "user NOT created",
            error: err
        })
    })
})

app.post('/login', (req, res) => {
    console.log('Login post request');
    UserModel.findOne({ username: req.body.username }).then(user => {
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "could not find the user"
            })
        }

        if (!compareSync(req.body.password, user.password)) {
            return res.status(401).send({
                success: false,
                message: "incorrect password"
            })
        }

        const payload = {
            username: user.username,
            id: user._id
        }
        const secretOrPrivateKey = 'Random string' // robust secret string put in environment variables

        const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: "1d" })

        return res.status(200).send({
            success: true,
            message: "logged in successfully",
            token: "Bearer " + token
        })
    })
})

app.get('/secureroute', passport.authenticate('jwt', {session: false}), (req, res) => {
    return res.status(200).send({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username
        }
    })
})

app.listen(5000, () => console.log("Listening to port 5000"));