var express = require('express');
const validateToken = require('../authentication/validateToken');
var router = express.Router();

/* GET users listing. */
router.get('/', validateToken,(req, res, next)=>{
  res.json(req.user);
});

module.exports = router;
