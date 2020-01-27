const express = require('express')
const router = express.Router()

//Require controller modules.
const item_controller = require('../controllers/itemController')
const category_controller = require('../controllers/categoryController')


/// ITEM ROUTES ///

//GET inventory home page
router.get('/', item_controller.index)

//GET request for creating a item.
router.get('/item/create', item_controller.create_get)

//POST request for creating item
router.post('/item/create', item_controller.create_post)

//GET request to delete item
router.get('/item/:id/delete', item_controller.delete_get)

//POST request to delete item
router.post('/item/:id/delete', item_controller.delete_post)

//GET request to update item
router.get('/item/:id/update', item_controller.update_get)

//POST request to update item
router.post('/item/:id/update', item_controller.update_post)

//GET request for one item
router.get('/item/:id', item_controller.detail)

//GET request for list of all items
router.get('/items', item_controller.list)


/// CATEGORY ROUTES ///

//GET request for creating a category.
router.get('/category/create', category_controller.create_get)

//POST request for creating category
router.post('/category/create', category_controller.create_post)

//GET request to delete category
router.get('/category/:id/delete', category_controller.delete_get)

//POST request to delete category
router.post('/category/:id/delete', category_controller.delete_post)

//GET request to update category
router.get('/category/:id/update', category_controller.update_get)

//POST request to update category
router.post('/category/:id/update', category_controller.update_post)

//GET request for one category
router.get('/category/:id', category_controller.detail)

//GET request for list of all categories
router.get('/categories', category_controller.list)

module.exports = router