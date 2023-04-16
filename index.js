const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const { hashSync, compareSync } = require('bcrypt');
const { UserModel, RunModel } = require('./services/database');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwt_decode = require('jwt-decode');
require('dotenv').config()

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
    // console.log(req.body)
    // console.log(UserModel)
    const user = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashSync(req.body.password, 10)
    })

    user.save()
        .then(user => {
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
    // console.log(req.body.email)
    // console.log('Login post request');
    UserModel.findOne({ email: req.body.email })
        .then(user => {
            // console.log('test')
            // console.log(user)
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
            const secretOrPrivateKey = process.env.SECRET_KEY

            const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: "14d" })

            // console.log('login test')
            // console.log(token)

            return res.status(200).send({
                success: true,
                message: "logged in successfully",
                token: "Bearer " + token
            })
        })
        .catch(err => { console.log(err) })
})

app.post('/addRun', passport.authenticate('jwt', { session: false }), (req, res) => {
    const decoded = jwt_decode(req.headers.authorization)
    // console.log(req.body)
    // console.log(RunModel)
    const run = new RunModel({
        // userID: req.body.userID,
        userID: decoded.id,
        mountainName: req.body.mountainName,
        trailName: req.body.trailName,
        runCounter: req.body.runCounter,
        difficulty: req.body.difficulty,
        date: req.body.date,
    })

    // console.log('run', run)

    run.save()
        .then(run => {
            res.send({
                success: true,
                message: "run created",
                run: {
                    id: run._id,
                    userID: run.userID,
                    mountainName: run.mountainName,
                    trailName: run.trailName,
                    runCounter: run.runCounter,
                    difficulty: req.body.difficulty,
                    date: run.date,
                }
            })
        })
        .catch(err => {
            res.send({
                success: false,
                message: "run NOT created",
                error: err
            })
        })
})

app.post('/deleteRun', passport.authenticate('jwt', { session: false }), (req, res) => {
    const decoded = jwt_decode(req.headers.authorization)
    // console.log(req.body)

    const run = {
        userID: decoded.id,
        mountainName: req.body.mountainName,
        trailName: req.body.trailName
    }

    RunModel.deleteOne(run)
        .then(run => {
            // console.log('run deleted', run)
            res.send({
                success: true,
                message: "run deleted",
            })
        })
        .catch(err => {
            res.send({
                success: false,
                message: "run NOT deleted",
                error: err
            })
        })
})

app.post('/updateRun', passport.authenticate('jwt', { session: false }), (req, res) => {
    const decoded = jwt_decode(req.headers.authorization)
    // console.log(typeof req.body.runCounter)
    const run = {
        "userID": decoded.id,
        "mountainName": req.body.mountainName,
        "trailName": req.body.trailName
    }

    RunModel.updateOne(run, { $set: { "runCounter": req.body.runCounter } })
        .then(run => {
            // console.log('run updated', run)
            res.send({
                success: true,
                message: "run updated",
            })
        })
        .catch(err => {
            res.send({
                success: false,
                message: "run NOT updated",
                error: err
            })
        })
})

// add run
// get runs by user id/token
// app.get('/getRuns', passport.authenticate('jwt', { session: false }), (req, res) => {
//     return res.status(200).send({
//         success: true,
//         message: "runs retrieved"
//     })
// }) 
//, async (err, user, info) => {
//    console.log('err: ', err, user, info);
//}
app.get('/getRuns', passport.authenticate('jwt', { session: false}), (req, res) => {
    const decoded = jwt_decode(req.headers.authorization)

    // console.log(decoded)
    const userMap = {
        "userID": decoded.id,
        "mountainName": req.query.mountainName
    }

    if (req.query.sortField && req.query.sortDir) {
        // console.log('sortF', req.query.sortField)
        // console.log('sortDir', req.query.sortDir)
        const field = req.query.sortField
        const sort = {}
        sort[field] = req.query.sortDir === 'ASC' ? 1 : -1

        // console.log('sort', sort)

        RunModel.aggregate(
            [
                { $match: userMap },
                { $sort: sort }
            ]
        )
            .then(runs => {
                console.log('found runs', runs)

                //map through each run to return only the data we want
                res.send({
                    success: true,
                    message: "asc sort runs found",
                    runs
                })
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: "asc sort runs NOT found",
                    error: err
                })
            })
    } else {
        RunModel.find(userMap)
            .then(runs => {
                console.log('found runs', runs)

                //map through each run to return only the data we want
                res.send({
                    success: true,
                    message: "runs found",
                    runs
                })
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: "runs NOT found",
                    error: err
                })
            })
    }
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})