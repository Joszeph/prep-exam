const { Router } = require('express');
const { validationResult } = require('express-validator');
const { getUserStatus, checkAuthentication } = require('../controllers/user'); 
const validation = require('../controllers/validation'); 
const Play = require('../models/play');
const {sortByLikes, sortByDate, getPlay, removePlay}= require('../controllers/play');

const router = Router();

//!checkAuthentication => check if you are guest or admin/creator
//!getUserStatus => get status Logged or Guest

//route to home
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

//route to create form
router.get('/create', getUserStatus, (req, res)=>{
  res.render('create',{
    title: 'Create new play',
    isLoggedIn:  req.isLoggedIn
  })
})

//route to add/create
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
   //isPublic: isPublic === 'on' ? true : false,
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

//route to details
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

//route to like button
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

//route to edit details form
router.get('/details/edit/:id',checkAuthentication, getUserStatus, async (req, res)=>{
  const playId = req.params.id;
  try{
  const play = await getPlay(playId)
    res.render('edit',{
      isLoggedIn: req.isLoggedIn,
      title:'Edit Page',
      ...play
      })
  }catch(err){
    console.error(err)
  }
})

//route to submit the details
router.post('/details/edit/:id',checkAuthentication, validation, async (req, res)=>{
 const playId = req.params.id;
try{
const editPlay = await Play.findByIdAndUpdate(playId,{
  title: req.body.title,
  description: req.body.description,
  imageUrl: req.body.imageUrl,
 // isPublic: req.body.isPublic
})
editPlay.execPopulate((err,_)=>{
  if(err) throw err;
  res.redirect('/')
})
console.log(editPlay)
}catch(err){
console.error(err)
}

})

//route to delete button
router.get('/delete/:id', async (req, res)=>{
  const playId = req.params.id;
  try{
    await Play.findByIdAndDelete(playId)
    res.redirect('/')
  }catch(err){
    console.error('Something went wrong with deleted item!')
    res.redirect('/')
  }  
})

//route to error page
router.get('*', async (req, res) => {
   await res.redirect('../static/404.html')
  })


module.exports = router;