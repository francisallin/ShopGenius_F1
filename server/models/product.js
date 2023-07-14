let mongoose = require('mongoose')

// create a model class
let listProduct = mongoose.Schema({
    firstName: String,
    lastName: String,
    talent: String,
    description: String,
    service: String,
    price: Number,
    remarks : String,
    imageName : String
},
{
    collection: "products"
})

module.exports = mongoose.model('Product', listProduct)