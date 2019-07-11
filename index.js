const express  =  require('express');
const app = express();
const connectDB = require('./config/db');


//connect db mongo
connectDB();

// Init Middleware
app.use(express.json({ extended: false}));

PORT = process.env.PORT || 5000;

app.listen(PORT, (err)=> {
    if(err){
        console.log('Unable to connect');
    }

    console.log(`PORT running on ${PORT}`);
})


app.use('/api/user',  require('./routes/api/users'));
app.use('/api/auth',  require('./routes/api/auth'));
app.use('/api/profile',  require('./routes/api/profile'));
app.use('/api/post',  require('./routes/api/posts'));

app.get('/', (req, res) => {
    res.send('Working Home Page');
})