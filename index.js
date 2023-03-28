const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const { hashSync, compareSync } = require('bcrypt');
const UserModel = require('./services/database');
const jwt = require('jsonwebtoken');
const passport = require('passport');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(passport.initialize());

require('./services/passport')

var whitelist = ['http://10.0.0.116:3000', 'http://localhost:3000']

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

//add user to db
app.post('/register', (req, res) => {
    console.log(req.body)
    const user = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashSync(req.body.password, 10)
    })

    user.save().then(user => {
        res.send({
            success: true,
            message: "user created",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,            
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

//login validation
app.post('/login', (req, res) => {
    console.log('Login post request');
    UserModel.findOne({ email: req.body.email }).then(user => {
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

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).send({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username
        }
    })
})

app.post('/addrun', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).send({
        success: true,
        message: "run added"
    })
})

app.get('/getruns', passport.authenticate('jwt', { session: false }), (req, res) => {})

// add run
// get runs by user id/token

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})