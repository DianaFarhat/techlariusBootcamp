const express = require('express');
const app = express();

// Set up the view engine before listening for requests
app.set('view engine', 'ejs');

// Import routes from routes.js
const routes = require('./routes/routes');

// Use the imported routes
app.use('/', routes);  

// Start the server and listen on the specified port
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running...');
});
