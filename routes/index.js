const { Router } = require('express');
const { validationResult } = require('express-validator');
const { getUserStatus, checkAuthentication } = require('../controllers/user'); 
const validation = require('../controllers/validation'); 
const Play = require('../models/play');
const {sortByLikes, sortByDate, getPlay}= require('../controllers/play');

const router = Router();

router.get('/', getUserStatus, async (req, res)=>{

  const playsGuest = await sortByLikes();
  const playsLogged = await sortByDate();

    res.render('home',{
        title: 'Home Page',
        isLoggedIn:  req.isLoggedIn,
        playsGuest,
        playsLogged
    })
})

router.get('/create', getUserStatus, (req, res)=>{
  res.render('create',{
    title: 'Create new play',
    isLoggedIn:  req.isLoggedIn
  })
})

router.post('/create',checkAuthentication, validation, async (req, res)=>{
  const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render('create',{
            message: errors.array()[0].msg
        })
    }

try{
  const{ title, description, imageUrl, isPublic }=req.body;
  const{ _id } = req.user; //this user pointed to checkAuthentication
  const createdAt = new Date().toDateString();

  const play = new Play({
    title,
    description,
    imageUrl,
    isPublic: isPublic === 'on' ? true : false,
    createdAt,
    creator: _id
  });

  await play.save();
  res.redirect('/');

}catch(err){
  console.error(err);
  res.redirect('/');
}
})

router.get('/details/:id',checkAuthentication, getUserStatus, async(req, res)=>{
  const id = req.params.id;
  const play = await getPlay(id);
  const isCreator = play.creator.toString() === req.user._id.toString();
  const isLiked = play.usersLiked.filter(x=>x.toString()=== req.user._id.toString())

  res.render('details',{
    isLoggedIn:  req.isLoggedIn,
    isLiked,
    isCreator,
    ...play
  })
})

router.get('/like/:id', checkAuthentication, async (req, res)=>{
  const playId = req.params.id;
  const {_id} = req.user;

  await Play.findByIdAndUpdate(playId,{
    $addToSet:{
      usersLiked: [_id]
    }
  })
  res.redirect(`/details/${playId}`)
})

router.get('*', (req, res) => {
    res.render('404', {
      title: 'Error Page'
    })
  })



module.exports = router;