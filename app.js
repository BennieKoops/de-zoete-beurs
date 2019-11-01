// requires voor express mongoose en body-parser
const   express     = require("express"),
        mongoose    = require("mongoose"),
        bodyparser  = require("body-parser");

let app = express();

// viewengine moet boven de routes staan
app.set("view engine", "ejs");

// landingspagina
app.get("/", function (req, res) {
    res.render("index");
});

// catch all pagina
app.get("*", function (req, res) {
    res.render("catchall")
});

// poort waarop de server luistert en reageert
app.listen(3000, function () {
    console.log ("De app is actief!");
});