const express = require('express');
const app = express();
const generator = require('generate-password');

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to render form and handle password generation
app.get('/', (req, res) => {
    res.render('index', { password: null });
  });
  
  // Route to handle password generation on the same page
  app.post('/', (req, res) => {
    // Generate a random password
    const password = generator.generate({
      length: 10,
      numbers: true
    });
  
    // Send the password back to the user on the same page
    res.render('index', { password: password });
  });

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
