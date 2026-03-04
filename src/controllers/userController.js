const mongoose = require('mongoose')
const User = require('../models/users.model.js')


async function httpGetUserById(req,res, next){
    try {
      const user = await User.findById(req.user.id).select("-password")
  
      if(!user) return res.status(404).json({message: 'User not found'})
  
    res.json(user)
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
    
}

async function httpGetAllUsers(req,res, next){
    try {
      const user = await User.find()
    res.json(user)
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }    
}

async function httpUpdateUser(req,res,next){
    try {
        const{username, email, password} = req.body
        //username length
        if(username.length > 20) return res.status(200).json({message: 'Username must not exceed 20 characters'})
            //format username removing whitespace and converting to lowercase
        const formattedUsername = username ? username.trim().replace(/\s/g, '').toLowerCase() : undefined
        //check if formatted username exist
        if(formattedUsername === (await User.findOne({username: formattedUsername}))) return res.status(400).json({message: 'Username already exist'})
            ////check if email is valid
        

        ///if email exist
        if(email === (await User.findOne({email}))) res.status(400).json({message: 'email already exist'})

            //format password 
        const formattedPassword = password ? password.trim() : undefined

        if(formattedPassword.length < 6) return res.status(400).json({message: 'password must be more than 6 characters'})

            //update user with provided information
            await User.findByIdAndUpdate(
                req.user.id,
            {
                username: formattedUsername,
                email,
                password: formattedPassword
            },
        {new: true}
        )
        res.status(200).json({
            success: true,
            message: 'Succesfully updated'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

async function httpDeleteUser (req,res,next){
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            res.status(404).json({message:"user not found"})
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"});
    }
    catch(error){
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

module.exports = {
    httpGetUserById,
    httpGetAllUsers,
    httpUpdateUser,
    httpDeleteUser,
}