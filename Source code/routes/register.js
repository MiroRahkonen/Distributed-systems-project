var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const {check} = require('express-validator');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

const Users = require('../models/Users');

router.get('/',(req,res)=>{
    res.render('register');
})

// Register a new account
router.post('/',upload.none(),
    check('password')
    .isLength({min: 6})
    .matches(/\d/)      //has a number
    .matches(/[a-z]/)   //has a lowercase letter
    .matches(/[A-Z]/),   //has an uppercase letter 
    async (req,res,next)=>{
        //Checking password is valid
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: "Password isn't strong enough"});
        }

        let userExists = await Users.findOne({username: req.body.username});
        if(userExists){
            //Account with email already exists
            return res.status(403).json({message: 'Account with username already exists'});
        }
        /*Encrypted hash is created from the password with bcrypt, 
        and the password is stored in an encrypted form in the database*/
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err) throw err;
            const encryptedPassword = hash;
            Users.create(
                {
                    username: req.body.username,
                    email: req.body.email,
                    password: encryptedPassword
                },
                (err)=>{
                    if(err) throw err;
                    return res.status(200).json({message: 'User created'});
                }
            )
        });
})


module.exports = router;