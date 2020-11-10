const { Router } = require('express');
const { validationResult } = require('express-validator');
const { getUserStatus, checkAuthentication } = require('../controllers/user'); 
const validation = require('../controllers/validation'); 
const Play = require('../models/play');

const router = Router();

router.get('/', getUserStatus, async(req, res)=>{
    res.render('home',{
        title: 'Home Page',
        isLoggedIn:  req.isLoggedIn

    })
})

router.get('*', (req, res) => {
    res.render('404', {
      title: 'Error Page'
    })
  })



module.exports = router;