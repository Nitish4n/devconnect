const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const jwtSecret = config.get("jwtSecret");


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
            return res.status(400).json({ errors: [ {msg : 'user already exist'}]});
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
        await user.save();

        payload = {
            user : {
                id : user.id
            }
        }

        

        jwt.sign(payload, jwtSecret, {expiresIn : "36000000"}, (err, token) => {
            if(err) throw err;

            res.json({ token });
        });
    
    } catch (err) {

        console.log(err);

        res.status(500).send('Server Error');
    }
    

})
module.exports = router;