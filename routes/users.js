const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Users not yet implemented: Just chillax. All good.');
});

module.exports = router;
