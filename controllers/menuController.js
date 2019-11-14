const mongoose = require("mongoose");

// requires voor de models
const gerechten   = require("../models/gerechten"),
      drinken     = require("../models/drinken");

function bouwGerechtenLijst(gang) {
    return new Promise( function (resolve, reject) {
        gerechten.find({gang: gang}, function (err, gerechtenGang) {
            let lijstGerechten = [];
            if (!err) {
                gerechtenGang.forEach(gerecht => {
                    let bestaat = false;
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
            let lijstDrinken = [];
            if (!err) {
                soortDrinken.forEach(drankje => {
                    let bestaat = false;
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
    let menu = {soepen, voorgerechten, hoofdgerechten, nagerechten, wijnen, bieren, frisdranken, koffies}
        res.render(route, {menu:menu});
}

exports.maakMenu = function (req, res) {
    bouwMenuLijst("menu/menu", res);
}
exports.menuItem = function (req, res) {
    let gang = req.body.gang;
    if (gang !== undefined) {
        let naamGerecht = req.body.naamGerecht,
            prijs = req.body.prijs,
            dieet = req.body.dieet,
            beschrijving = req.body.beschrijving,
            bestelbaar = req.body.bestelbaar;
        let nieuwGerecht = {
            gang: gang,
            naamGerecht: naamGerecht,
            prijs: prijs,
            dieet: dieet,
            beschrijving: beschrijving,
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
            beschrijving = req.body.beschrijving,
            bestelbaar = req.body.bestelbaar;
        var nieuwDrankje = { 
            soortDrinken: soortDrinken,
            naamDrinken: naamDrinken,
            prijs: prijs,
            wijnFlesPrijs: wijnFlesPrijs,
            beschrijving: beschrijving,
            bestelbaar: bestelbaar
        }
        if (soortDrinken === 'wijn') {
            nieuwDrankje["wijnSoort"] = wijnSoort;
        }
        drinken.create(nieuwDrankje, function (err, drankje) {
            if (err) {
                console.log("er is iets fout gegaan" + err);
            } else {
                res.redirect("/menu");
            }
        });
    }
}