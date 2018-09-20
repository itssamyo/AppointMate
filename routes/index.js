var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express App running' });
});

module.exports = router;
