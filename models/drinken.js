const mongoose = require("mongoose");

var drinkenSchema = mongoose.Schema({
    soortDrinken: String,
    wijnSoort: String,
    naamDrinken: String,
    prijs: Number,
    wijnFlesPrijs: Number,
    beschrijving: String,
    bestelbaar: String
});

module.exports = mongoose.model("drinken", drinkenSchema);