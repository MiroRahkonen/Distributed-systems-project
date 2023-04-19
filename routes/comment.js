var express = require('express');
const validateToken = require('../authentication/validateToken');
var router = express.Router();

const Comments = require('../models/Comments.js');
const Upvotes = require('../models/Upvotes.js');

router.post('/create',validateToken,async (req,res,next)=>{
    let newComment = await Comments.create({
        postID: req.body.postID,
        username: req.body.username,
        message: req.body.message
    })
    res.json(newComment);
})

router.get('/data/:postid',async (req,res,next)=>{
    let comments = await Comments.find({postID: req.params.postid});
    res.json(comments);
})

router.delete('/delete',async (req,res,next)=>{
    //Deleting a comment also deletes the upvote object
    await Comments.deleteOne({_id: req.body.commentID});
    await Upvotes.deleteOne({commentID: req.body.commentID});

    return res.json('Comment deleted');
})

module.exports = router;