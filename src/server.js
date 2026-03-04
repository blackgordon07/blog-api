require('dotenv').config
const http = require('http')
const app = require('./app.js')

const connectMongoose = require('./config/mongoose')

const PORT = process.env.PORT || 8000

const server = http.createServer(app)


const startServer = async ()=>{
    try {
        await connectMongoose()
       
        server.listen(PORT, ()=>{console.log(`Server listening on port http://localhost:${PORT}`)})
    } catch (error) {
        console.log(`Server failed to start: ${error.message}`)
    }
   
}

startServer()