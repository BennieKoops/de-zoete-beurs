const mongoose = require("mongoose");

var gerechtenSchema = mongoose.Schema({
    gang: String,
    naamGerecht: String,
    prijs: Number,
    alergenen: [],
    dieet: String,
    bestelbaar: String
});

module.exports = mongoose.model("gerechten", gerechtenSchema);