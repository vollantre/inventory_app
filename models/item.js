const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Declare schema for Item
const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100
    },
    description: {
      type: String,
      maxlength: 100
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    price: {
      type: Number
    },
    number_in_stock: {
      type: Number,
      required: true
    }
  }
)

//Virtual for item's url
ItemSchema
  .virtual('url')
  .get(() => '/inventory/item/' + this._id)

//Export model
module.exports = mongoose.model('Item', ItemSchema)