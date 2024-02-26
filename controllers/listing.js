const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken })

// index model
module.exports.index = async (req, res, next) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings })
}

// New
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
}

// show Route
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    // console.log(req.params.id)
    let listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect('/listings')
    }
    res.render('listings/show', { listing }); // Corrected path
}

// Create listings
module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()


    let url = req.file.path
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    // added geolocation feature
    newListing.geometry = response.body.features[0].geometry

    let savedListing = await newListing.save();
    console.log(savedListing)
    req.flash("success", "New Listing Created!")
    res.redirect('/listings'); // Corrected path
}

// edit route
module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect('/listings')
    }

    let originalImageUrl = listing.image.url
    //it's clounary Api that accetps the parameter in url to reduce the size of image
    originalImageUrl.replace('/upload', '/upload/h_300/,w_250')
    res.render('listings/edit', { listing, originalImageUrl }); // Corrected path
}

// update route
module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== 'undefined') {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { url, filename }
        await listing.save()
    }
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`); // Corrected path
}

// Destroy
module.exports.destroyListing = async (req, res, next) => {
    console.log(req.params.id)
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect('/listings'); // Corrected path
    console.log(deletedListing);
}
// search function

