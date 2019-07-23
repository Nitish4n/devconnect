const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
module.exports =  DbConnect =  async () =>{
    try{
        await mongoose.connect('mongodb+srv://devconnect:nitish82988@cluster0-onuwx.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true} , ()=>{
            console.log('Mongoose connected');
        })
    }catch(err){
        console.log(err.message)
        process.exit(1);
    }
}