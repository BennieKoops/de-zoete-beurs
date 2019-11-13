// requires voor express mongoose en body-parser
const   express     = require("express"),
        mongoose    = require("mongoose"),
        bodyparser  = require("body-parser");

let app = express();

let indexRoutes = require("./routes/index"),
    menuRoutes  = require("./routes/menu");

// viewengine moet boven de routes staan
app.set("view engine", "ejs");

// bodyparser instelling
app.use(bodyparser.urlencoded({extended: true}));

// static geeft een standaard map aan waarin bijvoorbeeld CSS bestanden staan
app.use(express.static("public"));

// mongoose set is apart gedefinieerd omdat er meerdere databases gebruikt gaan worden
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

// mongoose db koppelingen
mongoose.connect("mongodb://localhost:27017/menu");

app.use(indexRoutes);
app.use("/menu", menuRoutes);

// catch all pagina
app.get("*", function (req, res) {
    res.render("catchall");
});

// poort waarop de server luistert en reageert
app.listen(3000, function () {
    console.log ("De app is actief!");
});