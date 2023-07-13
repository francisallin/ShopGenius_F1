let express = require('express')
let router = express.Router();
let mongoose = require('mongoose')
let jwt = require('jsonwebtoken')
let contactController = require('../controllers/list')
let passport = require('passport')


// helper function for guard purposes
function requireAuth(req, res, next) {
    // check if the user is logged in 
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next();
}

/* GET Route for the Contact List page  - READ Operation*/
router.get('/', contactController.displayContactList)

/* GET Route for displaying Add page  - CREATE Operation*/
router.get('/add', requireAuth, contactController.displayAddPage)

/* POST Route for processing Add page  - CREATE Operation*/
router.post('/add', requireAuth, contactController.processAddPage)

/* GET Route for displaying Update page  - UPDATE Operation*/
router.get('/update/:id', requireAuth, contactController.displayUpdatePage)

/* PUT Route for processing Update page  - UPDATE Operation*/
router.post('/update/:id', requireAuth, contactController.processUpdatePage)

/* GET to perform Deletion  - DELETE Operation*/
router.get('/delete/:id', requireAuth, contactController.performDelete)

module.exports = router;