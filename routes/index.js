const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));

router.get('/login', passport(req, res){


module.exports = router;
