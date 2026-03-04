const mongoose = require('mongoose')
const Post = require('../models/post.model.js')
const User = require('../models/users.model.js')
const Category = require('../models/categories.model.js')


async function httpCreatePost(req,res){
    try {
        const {title, content, category}= req.body
        let formattedCategory

        if(category){
            //format category name
            formattedCategory = category.trim().replace(/\s/g, '-').toLowerCase()
        }

    //check if formatted category is specified but not found
    if(formattedCategory && !(await Category.findOne({name: formattedCategory}))) return res.status(404).json({message: 'Category not found'})

        //Create new post 
        const post = await Post.create({
            title,
            content,
            category: formattedCategory,
            author: req.user.id
        })

     res.status(201).json(post)

} 
catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

async function httpGetPosts(req,res,next){
    try {
        // Retrieve all posts and select specific fields
   const posts = await Post.find().populate("author", "-password")
   
   // Handle if no posts are found
   if(!posts) return res.status(404).json({message: error.message})

    res.status(200).json({posts})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

async function httpGetPostById(req,res,next){
    try {
        // Validate the provided post ID
     if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message: 'Invalid id '})

        //find post by id and populate related fields
    const post = await Post.findById(req.params.id)
    .populate({path: 'author', select: 'username -_id'})
    .populate({path: 'likes', select:'username -_id'})
    .select('title author content  category likes comment -_id')
    
        // Handle if no post is found
    if(!post) return res.status(404).json({message: 'post Not found '})

        res.status(200).json(post)

} catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

async function httpGetPostByCategory(req,res,next){
    try {
        //Retrieve the category from the query parameters
    const {category} = req.query

    // Format the category by trimming, 
    // replacing spaces with hyphens, and converting to lowercase
     
    let formattedCategory
    if(category){
        formattedCategory =category.trim().replace(/\s/g, '-').toLowerCase()
    }

     // Find posts matching the specified category and populate related fields
     const posts = await Post.find({ category: formattedCategory })
            .select('title content author category image likes comments')
            .populate({ path: 'author', select: 'username -_id' })
            .populate({ path: 'likes', select: 'username -_id' })
            .sort('-createdAt')

// Handle if no posts are found for the specified category
if (posts.length === 0) return res.status(404).json({message: 'category not found'})
   
    res.status(200).json({posts})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

async function httpGetPostsCount(req,res,next){
    try {
        //count number of post 
        const postsCount= await Post.countDocuments()

        //Handle if no posts are found
        if(postsCount===0) return res.status(404).json({message: 'No post found'})
            res.status(200).json({postsCount})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

async function httpUpdatePost (req,res,next){
    try {
        //check if post ID is valid
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message: 'Invalid id'})

            //find post by id and check if current user is author 
        const post= await Post.findOne({_id: req.params.id, author: _id})
        if(!post) return res.status(404).json({message: 'Unauthorized update request'})

        const {title, content, category} = req.body

        //validate title length
        if(title && title.length > 100) return res.status(400).json({message: 'field exceeds 100 characters'})

        let formattedCategory
        
        if(category){
            formattedCategory = category.trim().replace(/\s/g, '-').toLowerCase()
        }

        //check formatted category exists
    if(formattedCategory && (!await Category.findOne({name: formattedCategory}))) return res.status(400).json({message: 'Category not found '})

    //update post
    
const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
            title,
            content,
            category: formattedCategory,
    },
    {new: true}
)
    res.status(200).json({message: 'Update successful'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

async function httpDeletePost (req,res,next){
    try {
        // Validate the provided post ID
        if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message: 'Invalid ID'})
     

        // Find the post by ID and author
        const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
        if (!post) return res.status(400).json({message: 'Post not found'})

        // Delete the post
        await Post.deleteOne({ _id: post._id });

        res.status(200).json({ message: `post deleted` });
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }

}

module.exports={
    httpCreatePost,
    httpGetPosts,
    httpGetPostById,
    httpGetPostByCategory,
    httpGetPostsCount,
    httpUpdatePost,
    httpDeletePost
}