const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// enable jwt
let jwt = require('jsonwebtoken')
let DB = require('../config/database.config')

// create the User Model instance
const userModel = require('../models/user')
const User = userModel.User //alias

// create the Customer Model instance
// const customerModel = require('../models/customer')
// const Customer = customerModel.Customer //alias

module.exports.displayHomePage = (req, res, next) => {
    res.render('index', {title: 'ShopGenius', displayName: req.user ? req.user.displayName : ''})
}

module.exports.displayServicesPage = (req, res, next) => {
    res.render('services', {title: 'Services', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayContactPage = (req, res, next) => {
    res.render('contact',{title: 'Contact', displayName: req.user ? req.user.displayName : ''});
}

module.exports.displayLoginPage = (req, res, next) => {
    // Check if the user is already logged in
    if (!req.user) {
        res.render('login', 
        {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        })
    }
    else {
        return res.redirect('/')
    }
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        // server error?
        if (err) {
            return next(err)
        }
        // is there a user login error?
        if (!user) {
            req.flash('loginMessage', 'Authentication Error')
            return res.redirect('/login')
        }
        req.login(user, (err) => {
            // server error?
            if (err) {
                return next(err)
            }

            const payload = {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DB.Secret, {
                expiresIn: 604800 // 1 week
            })
            return res.redirect('/product')
        })
    })(req, res, next);
}

module.exports.displayRegisterPage = (req, res, next) => {
    // check if the user is not already login
    if (!req.user) {
        res.render('register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : '' 
        })
    }
    else {
        return res.redirect('/')
    }
}

module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName,
        role: 'customer'
    })

    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.log('Error: Inserting New User')
            if (err.name == "UserExistsError") {
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                )
                console.log('Error: User Already Exists!')
            }
            return res.render('register', {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : '' 
            })
        }
        else {
            // if no error exists, then registration is successful

            // redirect the user and authenticate them
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/')
            })
        }
    })
}

module.exports.displayCart = (req, res, next) => {
    res.render('cart', {title: 'Shopping Cart', displayName: req.user ? req.user.displayName : ''});
}

module.exports.performLogout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    });
}