var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
    if (req.user.rol === 'Estudiante')
        return res.redirect('/ejercicios/resolver');
    else if (req.user.rol === 'Profesor' || req.user.rol === 'Ayudante')
        return res.redirect('/ejercicios');
    else if(req.user.rol === 'Administrador')
        return res.redirect('/usuarios');
    else
        return res.redirect('/login');
    } else
        return res.redirect('/login');
});

module.exports = router;
