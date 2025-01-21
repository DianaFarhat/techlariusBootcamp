const express = require('express');
const app = express();
const generator = require('generate-password');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.render('index');
});

// Route to generate password
app.post('/generate', (req, res) => {
  // Generate a random password
  const password = generator.generate({
    length: 10,
    numbers: true
  });

  // Send the password back to the user
  res.send(`
    <h1>Generated Password: ${password}</h1>
    <a href="/">Go back</a>
  `);
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
