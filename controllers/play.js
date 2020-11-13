const Play = require('../models/play');

const getAllPlays = async () => { 
    const play = await Play.find().lean()
    return play;
}

const sortByLikes = async () =>{
    const plays = await getAllPlays();
    return plays.sort((a,b)=>b.usersLiked.length - a.usersLiked.length);
}

const sortByDate = async()=>{
    const plays = await getAllPlays();

    let fixDate = new Date();
    var dd = String(fixDate.getDate()).padStart(2, '0');
    var mm = String(fixDate.getMonth() + 1).padStart(2, '0'); 
    var yyyy = fixDate.getFullYear();
    fixDate = dd + '.' + mm + '.' + yyyy;

    let today = new Date()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    createdAt = fixDate + ' ' + time

    console.log(createdAt)
    return plays.sort((a,b)=> b.createdAt - a.createdAt)
    
}

const getPlay = async (id)=>{
    const play = await Play.findById(id).lean();
    return play;
}

module.exports = {
    getAllPlays,
    getPlay,
    sortByLikes,
    sortByDate
}