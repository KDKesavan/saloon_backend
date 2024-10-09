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
console.log(env,"env");
const db = mysql.createConnection({
  host: env.parsed.DB_HOST,
  user: env.parsed.DB_USER,
  password: env.parsed.DB_PASSWORD,
  database:env.parsed.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/formsubmit',async(req,res)=>{
  // const { username, email, password } = req.body;
    let body = req.body
    console.log(body,"body");
    
  if(body){
    try {
      const insertQuery = 'INSERT INTO users_data SET ?';
      await db.query(insertQuery, [body], function (err, result) {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
