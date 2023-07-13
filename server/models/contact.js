let mongoose = require('mongoose')

// create a model class
let listModel = mongoose.Schema({
    name: String,
    email: String,
    phone: Number
},
{
    collection: "lists"
})

module.exports = mongoose.model('List', listModel)