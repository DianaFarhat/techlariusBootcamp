
const express= require ("express");
const app= express();

const mongoose= require("mongoose");

mongoose.connect('mongodb+srv://dianasfarhat:Cr3tRBkk0TI3nIhM@cluster0.lsggv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
 
}).then(() => console.log('Connected to MongoDB Atlas!'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));


app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');
  });
  
app.post('/shortUrls', (req, res)=>{

})


app.listen(process.env.PORT || 3000);
