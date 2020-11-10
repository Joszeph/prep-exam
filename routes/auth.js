const { Router } = require('express');
const { saveUser, verifyUser, checkGestAccess, getUserStatus } = require('../controllers/user'); 
const { validationResult } = require('express-validator');
const validationRegister = require('../controllers/validationRegister');
const validationLogin = require('../controllers/validationLogin');

const router = Router();

router.get('/login', getUserStatus, checkGestAccess, (req,res) => {
    res.render('login', {title: 'Login Page', isLoggedIn: req.isLoggedIn })
}) 

router.get('/register', getUserStatus, checkGestAccess, (req, res)=>{
    res.render('register', {
        title: 'Register Page',
        isLoggedIn:  req.isLoggedIn
    })
})

router.post('/register', validationRegister, async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render('register',{
            message: errors.array()[0].msg
        })
    }

    try{
        await saveUser(req, res)
        res.redirect('/')
    }catch(err){
        console.error(err)
        res.redirect('/register')
    }
})

router.post('/login', validationLogin, async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render('login',{
            message: errors.array()[0].msg
        })
    }

   const status = await verifyUser(req, res);
   if(status){
       return res.redirect('/')
   }else{
       res.render('login', {message: 'Wrog username or password!'})
   }
})

router.get('/logout', (req, res)=>{
    res.clearCookie('aid');
    res.redirect('/')
})

module.exports = router;