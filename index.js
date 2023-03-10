const express = require('express')
const app = express()
const port = 3003
const bodyParser = require('body-parser').json()
const db = require('./services/db');
var cors = require('cors')
const {
  addUser,
  getUserByEmail
} = require('./utils/ski-run-helpers')
app.use(cors())

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

//ADDUSER
app.post('/addUser', [bodyParser, cors(corsOptions)], (req, res) => {
  const id = req.body.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  console.log('email', email)

  addUser(id, firstName, lastName, email, password)
  res.send()
})

app.get('/getUser', async (req, res) => {
  const map = await getUserByEmail(req.query.email)
  res.send(map)
})

//add run
//get runs for user

app.get('/', (req, res) => {
  res.send("hello world")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})