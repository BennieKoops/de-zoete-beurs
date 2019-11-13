const   express = require('express');

let router = express.Router();

let menuController = require('../controllers/menuController');

// menupagina
router.get("/", menuController.maakMenu);

router.post("/", menuController.menuItem);

// nieuw gerecht pagina
router.get("/gerechten/new", function (req, res) {
   res.render("menu/gerechten/new");
});

// nieuw drankje pagina
router.get("/drinken/new", function (req, res) {
    res.render("menu/drinken/new");
});

module.exports = router;