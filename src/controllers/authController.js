const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users.model.js')
const TokenBlacklist= require('../models/tokenblacklist.model.js')

let refreshTokens = []

//  REGISTER NEW USER 
async function httpRegisterUser(req,res,next){
    try {
        const {username, email, password} = req.body

        //check required fields provided
        if(!(username && email && password)) return res.status(400).json({message:'All fields are required'})

            const formattedEmail = email.trim().toLowerCase()

            //create new user 
            const user = await User.create({
                username,
                email: formattedEmail,
                password
            })

            res.status(201).json(user)
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message })
    }
}

async function httpRegisterAdmin(req,res,next){
    try {
        const{username,email,password,isAdmin} = req.body

        //check required fields are provided 
        if(!(username && email && password)) return res.status(400).json({message:'All fields are required'})

        //// Check if required admin status is set to true
        if (!isAdmin) return res.status(400).json({message: 'Set admin status to true'})

            const formattedEmail = email.trim().toLowerCase()

         // Create a new user with the provided details
        const admin = await User.create({
            username,
            email: formattedEmail,
            password,
            isAdmin:true
        })

        res.status(201).json(admin)
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message })
    }
}

async function httpLoginUser(req,res,next){
    try {
        const{email, password}= req.body

        //validate email and password are provided
        if(!(email && password)) return res.status(400).json({message: 'provide an email and password'})

        let user
        
        //find email
        if(email){
            const formattedEmail = email.trim().toLowerCase()
            user = await User.findOne({email: formattedEmail})
        }

         // Handle incorrect credentials for email
         if(!user) return res.status(401).json({message: 'Invalid email'})

                    // Compare password with hashed password
        const auth = await bcrypt.compare(password, user.password)

    if(!auth) return res.status(401).json({message: 'Invalid credentials'})

         // Generate and sign the access token
         const accessToken = generateAccessToken(user)
         const refreshToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.REFRESH_SECRET
          )
          refreshTokens.push(refreshToken)
        res.status(200).json({ accessToken, refreshToken})
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message })
    }
}

async function httpToken (req,res,next){
    try {
        
    const { token } = req.body
    if (!token) return res.status(401).json({ message: "No token provided" })
    if (!refreshTokens.includes(token)) return res.status(403).json({ message: "Invalid refresh token" })
  
    jwt.verify(token, process.env.REFRESH_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" })
  
      const user = {
        _id: payload.id, 
        email: payload.isAdmin 
    }
      const accessToken = generateAccessToken(user)
      res.json({ accessToken })
    })
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
  
}
  
async function httpLogoutUser (req,res,next){
    try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    //Add token to the blacklist
    await TokenBlacklist.create({token})
        res.status(200).json({message: 'Log out successful'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}


function generateAccessToken(user){
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
    )
}

module.exports={
    httpRegisterUser,
    httpRegisterAdmin,
    
    httpLoginUser,
    httpToken,
    httpLogoutUser,
}