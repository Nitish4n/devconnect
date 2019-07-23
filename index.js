const express = require("express");
const app = express();
const DbConnect = require('./config/db');

DbConnect();



const PORT = process.env.PORT || 3000 ;


app.listen(PORT, (err) => {
    if(err){ console.log('Issue in server Start '+ err.message)};

    console.log(`PORT ${PORT} is running`)
})


app.use('/api/user', require('./route/api/users'));

app.get('/', (req, res) => {
    res.send('Yup Done');
})