const express = require('express');
const app = express();
require('dotenv').config(); 


// Set up the view engine before listening for requests
app.set('view engine', 'ejs');

//Set up the db connection
const mongoose= require("mongoose");
const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, {
}).then(() => console.log('Connected to MongoDB Atlas!'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));


// Import routes from routes.js
const routes = require('./routes/routes');

// Use the imported routes
app.use('/', routes);  


// Start the server and listen on the specified port
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running...');
});
