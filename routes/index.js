var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Express2' });
});

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.render('layout_final', { title: 'Express2' });
});

module.exports = router;
