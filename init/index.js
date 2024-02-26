const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { object } = require("joi");

const Mongo_url = "mongodb://127.0.0.1:27017/wonderlust"

main().then(() => {
    console.log("connected to data base")
}).catch((err) => {
    console.log(err)
});


async function main() {
    await mongoose.connect(Mongo_url)
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "65ce55ecc510146779305493" }))
    await Listing.insertMany(initData.data);
    console.log("data was initilize");
};

initDB();