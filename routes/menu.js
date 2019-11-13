const   express = require('express'),
        mongoose = require('mongoose');

let router = express.Router();

// requires voor de models
var gerechten   = require("../models/gerechten"),
    drinken     = require("../models/drinken");

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

async function bouwMenuLijst(route, res) {
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
        res.render(route, {menu:menu});
}

// menupagina
router.get("/", function (req, res) {
    bouwMenuLijst("menu/menu", res);
    console.log("aanvraag");
});

router.post("/", function (req, res) {
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
                res.redirect("/");
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
                res.redirect("/");
            }
        });
    }
    console.log(gang)
});

// nieuw gerecht pagina
router.get("/gerechten/new", function (req, res) {
   res.render("menu/gerechten/new");
});

// nieuw drankje pagina
router.get("/drinken/new", function (req, res) {
    res.render("menu/drinken/new");
});

module.exports = router;