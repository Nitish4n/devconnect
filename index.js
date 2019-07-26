const express = require("express");
const app = express();
const DbConnect = require('./config/db');

DbConnect();


app.use(express.json({ extended : false}));
const PORT = process.env.PORT || 3000 ;


app.listen(PORT, (err) => {
    if(err){ console.log('Issue in server Start '+ err.message)};

    console.log(`PORT ${PORT} is running`)
})


app.use('/api/user', require('./route/api/users'));
app.use('/api/auth', require('./route/api/auth'));
app.use('/api/profile', require('./route/api/profile'));

app.get('/', (req, res) => {
    res.send('Yup Done');
})