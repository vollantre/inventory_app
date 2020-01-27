const validator = require('express-validator')
const Category = require('../models/category')
const Item = require('../models/item')

//Display list of all categories
exports.list = async (req, res, next) => {
  try {
    const categories = await Category.find()

    res.render('category_list', { title: 'Category list', categories })
  } catch (e) {
    next(e)
  }
}

//Display detail of one category
exports.detail = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    const items = await Item.find({'category': req.params.id})

    res.render('category_detail', { title: `Category: ${category.name}`, category, items })
  } catch (e) {
    next(e)
  }
}

//Display create category form on GET
exports.create_get = (req, res) => {
  res.render('category_form', { title: 'Create Category' })
}

//Handle create category request on POST
exports.create_post = [

  validator.body('name', 'Category name required').isLength({ min: 1 }).trim(),

  validator.sanitizeBody('name').escape(),

  async (req, res, next) => {
    try {
      const errors = validator.validationResult(req)

      const category = new Category(
        { name: req.body.name }
      )

      if(!errors.isEmpty()){
        return res.render('category_form', { title: 'Create Category', category, errors: errors.array() })
      } else {
        const found_category = await Category.findOne({'name': req.body.name})
        if(found_category) return res.redirect(found_category.url)

        await category.save()
        res.redirect(category.url)
      }
    } catch (e) {
      next(e)
    }
  }
] 

//Display delete category form on GET
exports.delete_get = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if(category === null){
      return res.redirect('/inventory/categories')
    }

    const items = await Item.find({'category': req.params.id})
    res.render('category_delete', { title: `Delete Category: ${category.name}`, items, category })
  } catch (e) {
    next(e)
  }
}

//Handle delete category on POST
exports.delete_post = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.categoryid)
    const items = await Item.find({'category': req.body.categoryid})

    if (items.length > 0) {
      return res.render('category_delete', { title: `Delete Category: ${category.name}`, items, category })
    } else {
      await Category.findByIdAndRemove(req.body.categoryid)
      res.redirect('/inventory/categories')
    }
  } catch (e) {
    next(e)
  }
}

//Display update category form on GET
exports.update_get = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    res.render('category_form', { title: 'Update Category', category })
  } catch (e) {
    next(e)
  }
}

//Handle update category on POST
exports.update_post =  [
  validator.body('name', 'Category name required').isLength({ min: 1 }).trim(),

  validator.sanitizeBody('name').escape(),

  async (req, res, next) => {
    try {
      const errors = validator.validationResult(req)

      const category = new Category(
        {
          name: req.body.name,
          _id: req.params.id
        }
      )

      if(!errors.isEmpty()){
        return res.render('category_form', { title: 'Update Category', category, errors: errors.array() })
      } else {
        const found_category = await Category.findOne({'name': req.body.name})
        if(found_category) return res.redirect(found_category.url)

        await Category.findByIdAndUpdate(req.params.id, category)
        res.redirect(category.url)
      }
    } catch (e) {
      next(e)
    }
  }
]