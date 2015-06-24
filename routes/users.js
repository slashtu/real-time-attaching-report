var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resourcexxx');
  return res.sendFile( __base+'build/assets/tmp/index.html' );
});

module.exports = router;
