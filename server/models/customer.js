// let mongoose = require('mongoose')
// let passportLocalMongoose = require('passport-local-mongoose')

// // Define cartProducts schema
// const cartProductSchema = new mongoose.Schema({
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
//     quantity: { type: Number, default: 1 }
//   });

// // Define customer schema
// let Customer = mongoose.Schema({
//     // name: String,
//     // email: String,
//     // phone: Number,
//     username: 
//     {
//         type: String,
//         default: '',
//         trim: true,
//         require: 'username is required'
//     },
//     email:
//     {
//         type: String,
//         default: '',
//         trim: true,
//         require: 'email address is required'
//     },
//     displayName:
//     {
//         type: String,
//         default: '',
//         trim: true,
//         require: 'Display Name is required'
//     },
//     cart: {
//         cartProducts: [cartProductSchema]
//     }
// },
// {
//     timestamps: true,
// },
// {
//     collection: "customers"
// }
// )

// // configure options for User Model

// let options = ({missingPasswordError: 'wrong / Missing Password'})

// Customer.plugin(passportLocalMongoose, options)

// module.exports = mongoose.model('customer', Customer)