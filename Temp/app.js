const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '171202Vn',
  database: 'myapp',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;

        if (result) {
          req.session.user = user;
          res.redirect('/');
        } else {
          res.send('Wrong username or password.');
        }
      });
    } else {
      res.send('User not found.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
