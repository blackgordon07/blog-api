const authRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const TokenBlacklist = require('../models/tokenblacklist.model.js')
const {authenticateToken} = require('../middleware/auth.js')
const{ httpRegisterUser, httpRegisterAdmin, httpLoginUser, httpToken, httpLogoutUser }= require('../controllers/authController.js')

  
authRouter.post('/register', httpRegisterUser)
authRouter.post('/register/admin', httpRegisterAdmin)
authRouter.post('/login', httpLoginUser)
authRouter.get('/token', httpToken)
authRouter.get('/logout', authenticateToken, httpLogoutUser)

module.exports = authRouter