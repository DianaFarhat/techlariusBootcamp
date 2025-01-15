// Get Required Libraries
const express= require ("express");
const app= express();

const mongoose= require("mongoose");
const ShortUrl= require('./models/shortUrl');


//Establish DB Connection
mongoose.connect('mongodb+srv://dianasfarhat:Cr3tRBkk0TI3nIhM@cluster0.lsggv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
 
}).then(() => console.log('Connected to MongoDB Atlas!'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

//Routes
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    const shortUrls= await ShortUrl.find();
    res.render('index', {shortUrls, shortUrls});
  });
  
app.post('/shortUrls', async (req, res)=>{
  await ShortUrl.create({full: req.body.fullUrl});
  res.redirect('/');
})

app.get('/:shortUrl', async (req, res)=> {
  const shortUrl= await ShortUrl.findOne({short: req.params.shortUrl})
  if (shortUrl== null){
    return res.sendStatus(404);
  }
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 3000);
