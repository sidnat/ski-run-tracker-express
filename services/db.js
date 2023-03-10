const mysql = require('mysql2/promise');
require('dotenv').config()

async function query(sql, params) {
    const config = {
        db: {
          host: process.env.DATABASE_HOST,
          user: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_USERNAME,
        }
      };
    const connection = await mysql.createConnection(config.db);
    const [results,] = await connection.execute(sql, params);
    connection.end()

    return results;
}

module.exports = {
    query
}