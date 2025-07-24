const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));

router.get('/login', passport.authenticate('github'), (req, res) =>{});

router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


module.exports = router;
