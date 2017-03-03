var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/index', { message: req.flash('loginMessage') });
});

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// process the login form
    router.post('/', passport.authenticate('local-login', {
        successRedirect : '/index', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

module.exports = router;