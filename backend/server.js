import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Connection to MYSQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to database with id ' + db.threadId);
});

const saltRounds = 10;
//POST
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: "Error hashing password" });
    }
    // Correct the query to include placeholders for each value
    const query = 'INSERT INTO login (name, email, password) VALUES (?, ?, ?)';
    // Pass the values directly without additional nesting
    const values = [name, email, hash];
    db.query(query, values, (error, data) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: "Error executing query" });
      } else {
        return res.json({
          message: 'User added successfully',
          insertId: data.insertId,
        });
      }
    });
  });
});




app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM login WHERE email = ?';

  db.query(query, [email], (err, data) => {
    if (err) {
      // handle error...
    } else if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (error, result) => {
        if (result) {
          return res.json('Success');
        } else {
          return res.json('Fail');
        }
      });
    } else {
      return res.json('Fail');
    }
  });
});


app.listen(8081, () => {
  console.log('Listening...');
});
