// requires voor express mongoose en body-parser
const   express     = require("express"),
        mongoose    = require("mongoose"),
        bodyparser  = require("body-parser");

let app = express();

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

// requires voor de models
var gerechten   = require("./models/gerechten"),
    drinken     = require("./models/drinken");

// landingspagina
app.get("/", function (req, res) {
    res.render("index");
});

// menupagina
app.get("/menu", function (req, res) {
    res.render("menu/menu", {gerechten:gerechten, drinken,drinken});
});

app.post("/menu", function (req, res) {
    var gang = req.body.gang;
    if (gang !== undefined) {
        var naamGerecht = req.body.naamGerecht,
            prijs = req.body.prijs,
            alergenen = req.body.alergenen,
            dieet = req.body.dieet,
            bestelbaar = req.body.bestelbaar;
        var nieuwGerecht = {
            naamGerecht: naamGerecht,
            prijs: prijs,
            alergenen: alergenen,
            dieet: dieet,
            bestelbaar: bestelbaar
        }
        gerechten.create(nieuwGerecht, function (err, gerecht) {
            if (err) {
                console.log("er is iets fout gegaan" + err);
            } else {
                res.redirect("/menu");
            }
        });
    } else {
        
    }
    console.log(gang)
});

// nieuw gerecht pagina
app.get("/menu/gerechten/new", function (req, res) {
   res.render("menu/gerechten/new");
});

// nieuw drankje pagina
app.get("/menu/drinken/new", function (req, res) {
    res.render("menu/drinken/new");
});

// catch all pagina
app.get("*", function (req, res) {
    res.render("catchall");
});

// poort waarop de server luistert en reageert
app.listen(3000, function () {
    console.log ("De app is actief!");
});