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
    return plays.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
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