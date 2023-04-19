require('dotenv').config();
const jwt = require('jsonwebtoken');
const validateToken = require('../authentication/validateToken');
var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

const Users = require('../models/Users');

router.get('/',(req,res,next)=>{
    res.render('login')
})

router.post('/', upload.none(), async (req,res,next)=>{
    let user = await Users.findOne({username: req.body.username});
    
    if(!user){
        return res.status(403).json({message: "Couldn't find an account with provided username"});
    }
    bcrypt.compare(req.body.password,user.password,(err,success)=>{
        if(err) throw err;
        if(success){
            const jwtPayload = {
                username: user.username
            }
            jwt.sign(
                jwtPayload,
                process.env.SECRET,
                {
                    expiresIn: 12000
                },
                (err,token)=>{
                    if(err) throw err;
                    return res.json({success: true, token})
                }
            )
        }
        else{
            return res.status(400).json({message: 'Password incorrect'});
        }
    })
})

module.exports = router;