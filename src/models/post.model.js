const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please add a title'],
        maxlength: [100, 'Please title must not exceed 100 characters'],
    },
    content:{
        type: String,
        required: [true, 'Please add a content'],
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true, 'Author details missing']
    },
    category:{
        type:String,
        required:[true , 'Select a category'],
        lowercase: true,
        trim: true,
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)