const userRouter = require('express').Router()
const {httpGetUserById, httpGetAllUsers, httpDeleteUser, httpUpdateUser} = require('../controllers/userController.js')
const {authenticateToken, authAdmin} = require('../middleware/auth.js')



userRouter.get('/:id', authenticateToken, httpGetUserById)
userRouter.get('/', httpGetAllUsers)
userRouter.patch('/update', httpUpdateUser)
userRouter.delete('/delete/:id',authenticateToken,authAdmin, httpDeleteUser)

module.exports = userRouter