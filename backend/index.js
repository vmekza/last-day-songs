import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();

//Connection to MYSQL
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Catherine261283',
  database: 'playlist',
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to database with id ' + db.threadId);
});
