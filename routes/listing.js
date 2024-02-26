const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingcontroller = require('../controllers/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


router.use(express.urlencoded({ extended: true }))

// router.rote - Listing route -Create route
router.route("/")
    .get(wrapAsync(listingcontroller.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingcontroller.createListing));


// /new make sure such route are placed before /:id route - or it will treat new as id
router.get('/new', isLoggedIn, listingcontroller.renderNewForm);

// // Show route Delete route Update route
router.route('/:id')
    .get(wrapAsync(listingcontroller.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingcontroller.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.destroyListing))

// Edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingcontroller.renderEditForm));

module.exports = router;