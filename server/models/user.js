// require modules for the User Model
let mongoose = require('mongoose')
let passportLocalMongoose = require('passport-local-mongoose')

// Define cartProducts schema
const cartProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, default: 1 }
  });

let User = mongoose.Schema(
    {
        username: 
        {
            type: String,
            default: '',
            trim: true,
            require: 'username is required'
        },
        email:
        {
            type: String,
            default: '',
            trim: true,
            require: 'email address is required'
        },
        displayName:
        {
            type: String,
            default: '',
            trim: true,
            require: 'Display Name is required'
        },
        role:{
            type: String,
            enum: ['customer', 'admin'],
            required: true
        },
        cart: {
            cartProducts: [cartProductSchema]
        }
    },
    {
        timestamps: true,
    },
    {
        collection: "users"
    }
)

// configure options for User Model

let options = ({missingPasswordError: 'wrong / Missing Password'})

User.plugin(passportLocalMongoose, options)
module.exports.User = mongoose.model('User', User)