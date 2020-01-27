const Item = require('../models/item')
const Category = require('../models/category')
const validator = require('express-validator')
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
 })

exports.index = async (req, res) => {
  try {
    const item_count = await Item.countDocuments()
    const category_count = await Category.countDocuments()
    res.render('index', { title: 'Inventory App', item_count, category_count })
  } catch (e) {
    res.render('index', { title: 'Inventory App', error: e })
  }
}

//Display list of all items
exports.list = async (req, res, next) => {
  try {
    const items = await Item.find({})
    res.render('item_list', { title: 'List of all items', items })
  } catch (e) {
    next(e)
  }
}

//Display detail of one item
exports.detail = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('category')

    res.render('item_detail', { title: `Item: ${item.name}`, item })
  } catch (e) {
    next(e)
  }
}

//Display create item form on GET
exports.create_get = async (req, res, next) => {
  try {
    const categories = await Category.find({})

    res.render('item_form', { title: 'Create item', categories })
  } catch (e) {
    next(e)
  }
}

//Handle create item request on POST
exports.create_post = [
  
  upload.single('image'),

  //Validate fields
  validator.body('name', 'Item name required').isLength({ min: 1 }).trim(),
  validator.body('category', 'Item category required').isLength({ min: 1 }).trim(),
  validator.body('price', 'Price must not be empty').isLength({ min: 1 }).trim(),
  validator.body('number_in_stock', 'Number of items in stock required').isLength({ min: 1 }).trim(),

  //Sanitize with wilcard
  validator.sanitizeBody('*').escape(),

  //Process request after validation and sanitization
  async (req, res, next) => {
    try {

      //Extract the validation errors from a request.
      const errors = validator.validationResult(req)

      const { name, category, description, price, number_in_stock } = req.body

      // Create a Item object with escaped and trimmed data.
      const item = new Item({
        name,
        category,
        description,
        price,
        number_in_stock,
        itemImage: req.file.filename
      })

      if(!errors.isEmpty()) {
        const categories = await Category.find({})

        res.render('item_form', { title: 'Create item', categories, item, errors: errors.array() })
      } else {
        await item.save()

        res.redirect(item.url)
      }

    } catch (e) {
      next(e)
    }
    
  }

]

//Display delete item form on GET
exports.delete_get = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
    res.render('item_delete', { title: `Delete item: ${item.name}`, item })
  } catch (e) {
    next(e)
  }
}

//Handle delete item on POST
exports.delete_post = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
    fs.unlinkSync('./public/images/' + item.itemImage)
    await Item.findByIdAndRemove(req.params.id)
    res.redirect('/inventory/items')
  } catch (e) {
    next(e)
  }
}

//Display update item form on GET
exports.update_get = async (req, res, next) => {
  try {
    const categories = await Category.find({})
    const item = await Item.findById(req.params.id)

    res.render('item_form', { title: `Update item: ${item.name}`, categories, item })
  } catch (e) {
    next(e)
  }
}

//Handle update item on POST
exports.update_post = [
  
  upload.single('image'),

  //Validate fields
  validator.body('name', 'Item name required').isLength({ min: 1 }).trim(),
  validator.body('category', 'Item category required').isLength({ min: 1 }).trim(),
  validator.body('price', 'Price must not be empty').isLength({ min: 1 }).trim(),
  validator.body('number_in_stock', 'Number of items in stock required').isLength({ min: 1 }).trim(),

  //Sanitize with wilcard
  validator.sanitizeBody('*').escape(),

  //Process request after validation and sanitization
  async (req, res, next) => {
    try {

      //Extract the validation errors from a request.
      const errors = validator.validationResult(req)

      const { body } = req
      // Create a Item object with escaped and trimmed data.
      const item = new Item({
        ...body,
        itemImage: req.file.filename,
        _id: req.params.id
      })

      if(!errors.isEmpty()) {
        const categories = await Category.find({})

        res.render('item_form', { title: 'Create item', categories, item, errors: errors.array() })
      } else {
        await Item.findByIdAndUpdate(req.params.id, item)

        res.redirect(item.url)
      }
    } catch (e) {
      next(e)
    }
  }
]