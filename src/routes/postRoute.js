const postRouter = require('express').Router()
const { httpGetPosts, httpCreatePost, httpGetPostById, httpGetPostByCategory, httpGetPostsCount, httpUpdatePost, httpDeletePost } = require('../controllers/postController.js')
const { httpDeleteUser } = require('../controllers/userController.js')
const {authenticateToken} = require('../middleware/auth.js')


postRouter.put('/:id',authenticateToken,httpUpdatePost)
postRouter.get('/count',authenticateToken, httpGetPostsCount)
postRouter.post('/create',authenticateToken,httpCreatePost)
postRouter.get('/', httpGetPosts)
postRouter.get('/:id', httpGetPostById)
postRouter.get('/', httpGetPostByCategory)
postRouter.delete('/:id', authenticateToken,httpDeletePost)



module.exports= postRouter