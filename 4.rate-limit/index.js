const express = require('express');
const app = express();
const rateLimit= require('express-rate-limit');

const port = 5000;  

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));



//Limiter Logic
const limiter= rateLimit({
  windowMs: 15 * 60 * 1000, //15 min interval or time frame
  max: 5, //limit each IP to 5 requests
  message: "You have exceeded the allowed number of requests. Try again in 15 minutes"

})

app.use(limiter);

//Routes
app.get('/', (req, res) => {
  res.render('index', { errorMessage: '' });
});



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
