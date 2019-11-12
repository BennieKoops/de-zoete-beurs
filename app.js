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

    
function bouwGerechtenLijst(gang) {
    return new Promise( function (resolve, reject) {
        gerechten.find({gang: gang}, function (err, gerechtenGang) {
            var lijstGerechten = [];
            if (!err) {
                gerechtenGang.forEach(gerecht => {
                    var bestaat = false;
                    // zet een vlag als item al in lijst staat
                    for (let i = 0; i < lijstGerechten.length; i++) {
                        if (gerecht.naamGerecht == gerechtenGang[i].naamGerecht){
                            bestaat = true;
                        }
                    }
                    if (!bestaat) {
                        lijstGerechten.push(gerecht);
                    }
                });
                resolve(lijstGerechten);
            }
        });
    });
}

function bouwDrankenLijst(soort) {
    return new Promise( function (resolve, reject) {
        drinken.find({soortDrinken: soort}, function (err, soortDrinken) {
            var lijstDrinken = [];
            if (!err) {
                soortDrinken.forEach(drankje => {
                    var bestaat = false;
                    for (let i = 0; i < lijstDrinken.length; i++) {
                        if (drankje.naamDrinken === soortDrinken[i].naamDrinken){
                            bestaat = true;
                        }
                    }
                    if (!bestaat) {
                        lijstDrinken.push(drankje);
                    }
                });
                resolve(lijstDrinken);
            }
        });
    })
}

async function bouwMenuLijst(menuRoute, res) {
    let soepen          = await bouwGerechtenLijst('soep'),
        voorgerechten   = await bouwGerechtenLijst('voorgerecht'),
        hoofdgerechten  = await bouwGerechtenLijst('hoofdgerecht'),
        nagerechten     = await bouwGerechtenLijst('nagerecht');
    
    let wijnen       = await bouwDrankenLijst('wijn'),
        bieren       = await bouwDrankenLijst('bier'),
        frisdranken  = await bouwDrankenLijst('fris'),
        koffies       = await bouwDrankenLijst('koffie');

    Promise.all(soepen, voorgerechten, hoofdgerechten, nagerechten).then((lijstGerechten) => {
        return lijstGerechten;
    });

    Promise.all(wijnen, bieren, frisdranken, koffies).then((lijstDrinken) => {
        return lijstDrinken;
    });
    var menu = {soepen, voorgerechten, hoofdgerechten, nagerechten, wijnen, bieren, frisdranken, koffies}
        res.render(menuRoute, {menu:menu});
}

// landingspagina
app.get("/", function (req, res) {
    res.render("index");
});

// menupagina
app.get("/menu", function (req, res) {
    bouwMenuLijst("menu/menu", res);
    console.log("aanvraag");
});

app.post("/menu", function (req, res) {
    let gang = req.body.gang;
    if (gang !== undefined) {
        let naamGerecht = req.body.naamGerecht,
            prijs = req.body.prijs,
            alergenen = req.body.alergenen,
            dieet = req.body.dieet,
            bestelbaar = req.body.bestelbaar;
        let nieuwGerecht = {
            gang: gang,
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
        let soortDrinken = req.body.soortDrinken,
            wijnSoort = req.body.wijnSoort,
            naamDrinken = req.body.naamDrinken,
            prijs = req.body.prijs,
            wijnFlesPrijs = req.body.wijnFlesPrijs,
            bestelbaar = req.body.bestelbaar;
        let nieuwDrankje = { 
            soortDrinken: soortDrinken,
            wijnSoort: wijnSoort,
            naamDrinken: naamDrinken,
            prijs: prijs,
            wijnFlesPrijs: wijnFlesPrijs,
            bestelbaar: bestelbaar
        }
        drinken.create(nieuwDrankje, function (err, drankje) {
            if (err) {
                console.log("er is iets fout gegaan" + err);
            } else {
                res.redirect("/menu");
            }
        });
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