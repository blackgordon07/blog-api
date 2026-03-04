const categoriesRouter = require('express').Router()
const {authenticateToken, authAdmin} = require('../middleware/auth.js')
//const authAdmin = require('../middleware/auth.js')
const { httpCreateCategory, httpGetCategories, httpGetCategoryByID, httpUpdateCategory, httpDeleteCategory } = require('../controllers/categoriesController.js')

categoriesRouter.post('/create', authenticateToken,authAdmin, httpCreateCategory)
categoriesRouter.get('/',httpGetCategories)
categoriesRouter.get('/:id', httpGetCategoryByID)
categoriesRouter.put('/:id',authenticateToken,authAdmin, httpUpdateCategory)
categoriesRouter.delete('/:id', authenticateToken,authAdmin,httpDeleteCategory)


module.exports = categoriesRouter