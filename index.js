const express = require('express')
const app = express()
const port = 4000
const database = require("./src/config/databaseConnection")
const bodyParser = require('body-parser');
const cors = require("cors")
const mysql = require('mysql');
const env = require('dotenv').config(); // Load environment variables from .env file


app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
console.log("enter express");
console.log(env, "env");
let connection;
function handleDisconnect() {
  connection = mysql.createConnection({
    host: env.parsed.DB_HOST,
    user: env.parsed.DB_USER,
    password: env.parsed.DB_PASSWORD,
    database: env.parsed.DB_NAME
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error when connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Reconnect after 2 seconds
    }
  });

  connection.on('error', (err) => {
    console.error('MySQL error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect if connection is lost
    } else {
      throw err;
    }
  });
}

handleDisconnect();
// const db = mysql.createConnection({
//   host: env.parsed.DB_HOST,
//   user: env.parsed.DB_USER,
//   password: env.parsed.DB_PASSWORD,
//   database:env.parsed.DB_NAME
// });

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/formsubmit', async (req, res) => {
  // const { username, email, password } = req.body;
  let body = req.body
  console.log(body, "body");

  if (body) {
    try {
      const insertQuery = 'INSERT INTO users_data SET ?';
      await connection.query(insertQuery, [body], function (err, result) {
        if (err) {
          console.error('Error signing up:', err);
          res.status(500).json({ success: false, message: 'Error signing up' });
          return;
        }
        console.log("1 record inserted");
        res.status(201).json({ success: true, message: 'User signed up successfully' });
      });
    } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ success: false, message: 'Error signing up' });
    }

  }

})
app.get('/getData', async (req, res) => {

  try {
    const insertQuery = 'SELECT * FROM `users_data`';
    await connection.query(insertQuery, function (err, result) {
      if (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ success: false, message: 'Error signing up' });
        return;
      } else {
        console.log(result, "result");
        console.log("data getede", result.length);
        res.send(result)
        // res.status(201).json({ success: true, message: 'User signed up successfully' });

      }
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ success: false, message: 'Error signing up' });
  }


})

app.post('/sendMsgOffers', async (req, res) => {
  let body = req.body
  console.log(body, "body");

  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0'); // Get day and add leading zero if needed
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const year = today.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  const Message = ` Happy Birthday ${body.name}! This month, enjoy an exclusive offer at Servesh Saloon just for you. Visit us and celebrate in style!`
  console.log(formattedDate); // Output: DD-MM-YYYY
  let Datas = {}
  Datas.username = body.name
  Datas.userid = body.id
  Datas.date = formattedDate
  Datas.msg = Message

  try {
    const insertQuery = 'INSERT INTO offers_send_datas SET ?';
    await connection.query(insertQuery, [Datas], function (err, result) {
      if (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ success: false, message: 'Error signing up' });
        return;
      }
      console.log("1 record inserted");
      res.status(201).json({ success: true, message: 'User signed up successfully' });
    });
  } catch (error) {

  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
