var express = require('express');
var router = express.Router();

const Upvotes = require('../models/Upvotes.js');

router.post('/create',async (req,res)=>{
    
    if(req.body.type === 'post'){
        await Upvotes.create(
            {
                postID: req.body.postID,
                type: req.body.type,
                count: 0,
                upvoters: []
            }
        )
    }
    else if(req.body.type === 'comment'){
        await Upvotes.create(
            {
                commentID: req.body.commentID,
                postID: req.body.postID,
                type: req.body.type,
                count: 0,
                upvoters: []
            }
        )
    }

    res.json('upvote object created');
})

router.put('/post/:id',async (req,res)=>{
    let upvoteData = await Upvotes.findOne({postID: req.body.postID,type: 'post'});

    if(req.body.change == 1){
        upvoteData.count += 1;
        upvoteData.upvoters.push(req.body.upvoter);
    }
    else if(req.body.change == -1){
        upvoteData.count -= 1;
        //Removing upvoter from the list
        const i = upvoteData.upvoters.indexOf(req.body.upvoter);
        upvoteData.upvoters.splice(i,1);
    }

    upvoteData.save();
    res.json('Upvote saved');
})

router.put('/comment/:id',async (req,res)=>{
    let upvoteData = await Upvotes.findOne({commentID: req.body.commentID})
    
    if(req.body.change == 1){
        upvoteData.count += 1;
        upvoteData.upvoters.push(req.body.upvoter);
    }
    else if(req.body.change == -1){
        upvoteData.count -= 1;
        //Removing upvoter from the list
        const i = upvoteData.upvoters.indexOf(req.body.upvoter);
        upvoteData.upvoters.splice(i,1);
    }
    
    upvoteData.save();
    res.json('Upvote saved');
})

router.get('/post/:id',async (req,res)=>{
    let upvoteData = await Upvotes.findOne({postID: req.params.id,type: 'post'})
    res.json(upvoteData);
})

router.get('/comment/:id',async (req,res)=>{
    let upvoteData = await Upvotes.findOne({commentID: req.params.id});

    res.json(upvoteData);
})


module.exports = router;