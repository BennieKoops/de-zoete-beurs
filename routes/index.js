const express = require('express');

let router = express.Router();

// landingspagina
router.get("/", function (req, res) {
    res.render("index");
});

module.exports = router;