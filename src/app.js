const express = require('express')
const authRouter = require('./routes/authRoute.js')
const userRouter = require('./routes/userRoute.js')
const postRouter = require('./routes/postRoute.js')
const categoriesRouter = require('./routes/categoriesRoute.js')
const app = express()

app.use(express.json())


app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/categories', categoriesRouter)


module.exports = app;