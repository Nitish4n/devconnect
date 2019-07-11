const config = require('config');
const mongoose = require('mongoose');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db,{ useNewUrlParser: true }, () => {
            console.log('Mongo DB Connecteddd');
        });
    } catch (err){
        console.log(err.message)
        process.exit(1);
    }
}

module.exports = connectDB;
