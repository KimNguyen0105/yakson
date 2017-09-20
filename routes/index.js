var express = require('express');
var router = express.Router();
var HomeController = require('../controller/HomeController');

/* GET home page. */
router.get('/',HomeController.Index );

module.exports = router;
