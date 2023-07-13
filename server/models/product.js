let mongoose = require('mongoose')

// create a model class
let listProduct = mongoose.Schema({
    brand: String,
    model: String,
    year: Number,
    trim: String,
    color: String,
    price: Number
},
{
    collection: "products"
})

module.exports = mongoose.model('Product', listProduct)