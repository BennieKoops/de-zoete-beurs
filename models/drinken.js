const mongoose = require("mongoose");

var drinkenSchema = mongoose.Schema({
    wijnAlcoholFrisKoffie: String,
    wijnSoort: String,
    naamDrinken: String,
    prijs: Number,
    wijnFlesPrijs: Number,
    bestelbaar: String
});

module.exports = mongoose.model("drinken", drinkenSchema);