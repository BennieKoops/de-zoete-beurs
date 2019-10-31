// requires voor express mongoose en body-parser
const   express     = require("express"),
        mongoose    = require("mongoose"),
        bodyparser  = require("body-parser");

let app = express();

// viewengine moet boven de routes staan
app.set("viewengine", "ejs");
