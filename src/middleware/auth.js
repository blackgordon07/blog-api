const jwt = require("jsonwebtoken");
const TokenBlacklist = require('../models/tokenblacklist.model');

async function authenticateToken(req, res, next) {
    try {
            const authHeader = req.headers['authorization']
    
            // Check if Authorization header exists
            if(!authHeader) return res.status(401).json({message: 'Unauthorized user'})
    
           const token = authHeader && authHeader.split(' ')[1]
      
    if (!token) {
        return res.status(401).json({ message: "Token missing" })
    }
    
        //Check if the token is blacklisted
        const blacklistedToken = await TokenBlacklist.findOne({token})
    
        // Handle blacklisted token
        if(blacklistedToken) return res.status(401).json({message: 'invalid token'})
      
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            return res.status(403).json({ message: "Invalid or expired token" })
          }
      
          req.user = payload
          next()
        })
        } catch (error) {
            console.error(error)
          res.status(400).json({message: error.message}) 
        }
}

async function authAdmin(req,res,next){
  if(!req.user.isAdmin) return res.status(403).json({message: "Access Denied, only admin can make such request"})
    next()
}

module.exports = {
  authenticateToken, 
  authAdmin,
}