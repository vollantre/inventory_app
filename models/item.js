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
      type: String,
      required: true
    },
    number_in_stock: {
      type: Number,
      required: true
    },
    itemImage: {
      type: String,
      required: true
    }
  }
)

//Virtual for item's url
ItemSchema
  .virtual('url')
  .get(function () {
    return '/inventory/item/' + this._id
  })

//Export model
module.exports = mongoose.model('Item', ItemSchema)