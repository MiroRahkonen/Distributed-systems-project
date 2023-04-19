var express = require('express');
var router = express.Router();
const validateToken = require('../authentication/validateToken');

const Posts = require('../models/Posts.js');
const Comments = require('../models/Comments.js');
const Upvotes = require('../models/Upvotes.js');

router.get('/:postid',(req,res,next)=>{
    res.render('post');
})

router.post('/create',validateToken,async (req,res,next)=>{
    const newPost = await Posts.create(
        {
            username: req.user.username,
            title: req.body.title,
            message: req.body.message
        }
    )
    res.json(newPost);
})

router.delete('/delete',async (req,res,next)=>{
    //Deleting a post deletes all of its comments and the upvote objects
    await Posts.deleteOne({_id: req.body.postID});
    await Comments.deleteMany({postID: req.body.postID});
    await Upvotes.deleteMany({postID: req.body.postID});
    return res.json('Post and comments deleted');
})

router.get('/data/all',async (req,res)=>{
    const allposts = await Posts.find();
    res.json(allposts);
})

router.get('/data/:postid',async (req,res,next)=>{
    try{
        let post = await Posts.findOne({_id: req.params.postid})
        res.json(post)
    } catch(err){
        res.status(400).json({message: "Couldn't find post"});
    }
})

module.exports = router;