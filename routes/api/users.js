const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');


// @ route GET api/user
// @ desc : get user list
// @ access Public 
//router.get('/', (req, res) => {res.send('Users api working fine')});



// @route POST api/user/register
// @desc  Register user
// access Public

router.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please provide valid email').isEmail(),
    check('password', 'Password must be min 6 character').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({erros: errors});
    }else{
        console.log(' no errors')
    }
    const {name, email, password } = req.body;

    try{
        
        let user = await User.findOne({ email });
        
        if(user) {
            console.log('trying4');
            res.status(400).json({ errors: [ {msg : 'user already exist'}]});
        }else{
            console.log('not exist')
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password,
        })

        
        //create salt
        const salt = await bcrypt.genSalt(10);
        
        user.password = await bcrypt.hash(password, salt);
        console.log('ok password done')
        await user.save();

        res.send('User resgistered');
    
    } catch (err) {

        console.log(err.message);

        res.status(500).send('Server Error');
    }
    
    //check user exist

    res.send('Hello Register now');
})
module.exports = router;