#! /usr/bin/env node

console.log('This script populates some test items, items, categories and iteminstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true')

// Get arguments passed on command line
const userArgs = process.argv.slice(2)
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument')
    return
}
*/
const Category = require('./models/category')
const Item = require('./models/item')


const mongoose = require('mongoose')
const mongoDB = userArgs[0]
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))


const items = []
const categories = []

//Function for creating new categories
const categoryCreate = async (name, description) => {
  category = new Category({ name: name, description: description })
  
  try {
    await category.save()

    console.log('New category: ' + category)
    categories.push(category)
     
  } catch(err) {
    console.error('FINAL ERROR: ' + err)
  }
}

//Function for creating items
const itemCreate = async (name, description, price, number_in_stock, category) => {
  itemdetail = { 
    name,
    description,
    price,
    number_in_stock
  }
  if (category != false) itemdetail.category = category

  try {
    const item = new Item(itemdetail)    
    await item.save()

    console.log('New item: ' + item)
    items.push(item)

  } catch (e) {
    console.error('FINAL ERROR: ' + err)
  }
}

const createCategories = async () => {
  await categoryCreate('Sewing Thread', 'a long, thin strand of cotton, nylon, or other fibers used in sewing or weaving.')

  await categoryCreate('Needle', 'a very fine slender piece of metal with a point at one end and a hole or eye for thread at the other, used in sewing.')

  await categoryCreate('Cinta', 'Una cinta es una banda fina de un material flexible, típicamente textil que también puede ser plástico o a veces metal, usado sobre todo para adornar, envolver y atar diferentes objetos.')
}

const createItems = async () => {

  await itemCreate('Cono', 'Cono de 2500 yardas creado por Sable C.A', 120000, 200, categories[0]._id)

  await itemCreate('Agujas punta de bola', 'Agujas punta de bola para maquinas singer', 30000, 1000, categories[1]._id)

  await itemCreate('Hilo pequeño', 'Hilo de 400 yardas fabricado por la empresa Cebra', 30000, 500, categories[0]._id)

  await itemCreate('Raso', 'Cinta raso para decorar', 10000, 600, categories[2]._id)
}

createCategories().then((res) => {
  console.log(categories)
  createItems().then((res) => {
    mongoose.disconnect().then((res) => process.exit(-1))
  })
})
