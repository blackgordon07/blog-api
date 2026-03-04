const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connection.once('open', () => console.log('MongoDB is connected'));
mongoose.connection.on('error', err => console.error(err.message));

async function connectMongoose (){
    try {
        await mongoose.connect(MONGODB_URI)
    } catch (error) {
        console.error(error.message)
    }
}


module.exports = connectMongoose
