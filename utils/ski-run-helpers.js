//add user - registers user

// get user

//add runs
const db = require('../services/db');

const addUser = (id, firstName, lastName, email, password) => {
  const queryString = `INSERT INTO users (id, first_name, last_name, email, password) VALUES ("${id}", "${firstName}", "${lastName}", "${email}", "${password}");`;

  return db.query(queryString)
    .then((res) => {
      return true
    })
    .catch((error) => {
      console.log(error);
    });
}

const getUserByEmail = async (email) => {
  const queryString = `SELECT * FROM users WHERE email = "${email}";`

  return await db.query(queryString)
  .then((res) => {
    if (res[0]) {
      return res[0]
    }

    return null
  })
  .catch((error) => {
    console.log(error)
  })
}

const addRunByUserID = (id, userID, mountainName, runName, runCounter) => {
  const queryString = `INSERT INTO users (id, first_name, last_name, email, password) VALUES ("${id}", "${firstName}", "${lastName}", "${email}", "${password}");`;

  return db.query(queryString)
    .then((res) => {
      return true
    })
    .catch((error) => {
      console.log(error);
    });
}

const updateRunCounter = (id, runCounter) => {
  const queryString = `UPDATE runs SET run_counter = "${runCounter} WHERE id = "${id}";`;

  return db.query(queryString)
    .then((res) => {
      return true
    })
    .catch((error) => {
      console.log(error);
    });
}

const getRunsByUserAndMountain = async (userID, mountain) => {
  const queryString = `SELECT * FROM runs WHERE user_id = "${userID}" AND mountain_name = "${mountain};`

  return await db.query(queryString)
  .then((res) => {
    if (res[0]) {
      return res[0]
      // res[0] or res?
    }

    return null
  })
  .catch((error) => {
    console.log(error)
  })
}

module.exports = {
  addUser,
  getUserByEmail
}