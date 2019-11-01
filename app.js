// requires voor express mongoose en body-parser
const   express     = require("express"),
        mongoose    = require("mongoose"),
        bodyparser  = require("body-parser");

let app = express();

// viewengine moet boven de routes staan
app.set("viewengine", "ejs");

// poort waarop de server luistert en reageert
app.listen(3000, function () {
    console.log ("De app is actief!");
});