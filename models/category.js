const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Declare schema for Category
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    }
  }
)

//Virtual for category's url
CategorySchema
  .virtual('url')
  .get(function () {
    return '/inventory/category/' + this._id
  })

//Exports model
module.exports = mongoose.model('Category', CategorySchema)