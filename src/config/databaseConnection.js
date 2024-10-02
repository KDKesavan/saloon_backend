// // Import necessary modules
// const mysql = require('mysql');
// const env = require('dotenv').config(); // Load environment variables from .env file

// // Create Express.js app


// // Create MySQL database connection pool
// console.log(env,"env");
// const db = mysql.createPool({
//   connectionLimit: 10,
//   host: env.DB_HOST,
//   user: env.DB_USER,
//   password: env.DB_PASSWORD,
//   database:env.DB_NAME
// });

// // Test database connection
// db.getConnection((err, connection) => {
//   if (err) {
//     console.error('Error connecting to database: ', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
//   connection.release();
// });




