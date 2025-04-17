// server.js

const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Assuming your HTML file is in a 'public' directory

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  // Check user credentials in the database
  const query = `SELECT * FROM users WHERE email = ? AND password = ? AND role = ?`;
  connection.query(query, [email, password, role], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length > 0) {
      // User authenticated, redirect to dashboard based on role
      switch (role) {
        case 'customer':
          res.redirect('/customer_dashboard');
          break;
        case 'project manager':
          res.redirect('/project_manager_dashboard');
          break;
        case 'tester':
          res.redirect('/tester_dashboard');
          break;
        default:
          res.status(400).send('Invalid role');
      }
    } else {
      // Invalid credentials
      res.status(401).send('Invalid email or password');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
