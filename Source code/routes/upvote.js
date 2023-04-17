var express = require('express');
var router = express.Router();

const Upvotes = require('../models/Upvotes.js');

router.post('/create',async (req,res)=>{
    console.log('aaaaaa');
    
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

router.get('/:id',(req,res)=>{
    console.log(req.params.id);


    res.json('aaaa');
})

module.exports = router;