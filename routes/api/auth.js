const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @ route GET 
// @ desc : get user list
// @access Logged User with x-auth-token 
router.get('/',auth,  async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        res.status(500).json({msg : "No Data Found"})
    }
});


// @ route POST
// @ desc  Create Login to authorize user
// @access Public
router.post('/login', [
        check('email', 'Email is Required').isEmail(),
        check('password', 'Invalid Password').not().isEmpty()
    ] , async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({erros: errors});
    }else{
        console.log(' no errors')
    }
    

    const {email, password} = req.body;

    try{
        let user = await User.findOne({ email });

        if(!user){
            res.status(500).json({ msg: "Invalid Credentials"});
        }

        res.json({ user });
    } catch (err){
        res.status(500).json({ msg: "Invalid Credentials"});
    }
})

module.exports = router;