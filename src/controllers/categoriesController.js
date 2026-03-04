const mongoose = require('mongoose')
const Category = require('../models/categories.model.js')

async function httpCreateCategory(req,res,next){
    try {
        const {name} = req.body
    //validate category is provided
    if(!name) return res.status(400).json({message: 'Provide category'})

        // create category
        const category = await Category.create({name})
    res.status(201).json({message: 'Category created successfully'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
}

async function httpGetCategories(req,res,next){

    try {
        const categories = await Category.find({})
    .select('name')
    .sort('-createdAt') 

    //handle if no categories are found
    if(categories.length === 0) return res.status(404).json({message: 'No category found'})

        res.status(200).json({categories})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message}) 
    }
    
}

async function httpGetCategoryByID(req,res,next){

    try {
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({message: 'Id not found'})

            const category = await Category.findById(req.params.id)
            .select('-_id -__v')
            //.populate({path:'name', '_id'})
    
            if(!category) return res.status(404).json({message: 'Category not found'})
    
                res.status(200).json({category})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message})
    }
    
}

async function httpUpdateCategory(req,res,next){

    try {
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({message: 'Id not found'})

            const{name}= req.body
            if(!name) return res.status(400).json({message:'Provide category name'})
                //format name by removing whitespaces and converting to lowercase
            const formmattedName= name.trim().replace(/\s/g, '-').toLowerCase()
    
            //check if name already exist
            if(formmattedName === await Category.findOne({name: formmattedName})) return res.status(400).json({message: 'name already exists'})
    
                //check category exists
            categoryExist = await Category.findById(req.params.id)
    
            //handle if category not found
            if(!categoryExist) res.status(404).json({message: 'Category not found'})
    
            const category = await Category.findByIdAndUpdate(req.params.id,
                {name},
                {new: true}
            )
    
            res.status(200).json({message: 'Update successful'})
    
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message})
    }
}

async function httpDeleteCategory(req,res,next){

    try {
          //validate id
    if(!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({message: 'Id not found'})

        const category = await Category.findById(req.params.id)

    if(!category) return res.status(404).json({message:'Category not found'})

    await Category.deleteOne({_id: req.params.id})

    res.status(200).json({message: 'Category deleted'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: error.message})
    }
  
}

module.exports = {
    httpCreateCategory,
    httpGetCategories,
    httpGetCategoryByID,
    httpUpdateCategory,
    httpDeleteCategory
}