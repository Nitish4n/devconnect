const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../modal/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

// @ route /user/test
// @ access public
// @ desc User test route

router.get('/test', (req, res) => {
    res.send('Test User working');
})


router.post('/login', [
        check('email', 'Invalid Email').isEmail(),
        check('password', 'Password is required').exists()
    ] , async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
    }
    const { email, password } = req.body;
    
    try{
        
        let user = await User.findOne({ email });
        
        if(!user){
            return res.status(404).json({ msg: "Invalid Credentials"});
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch){
            return res.status(404).json({ msg: "Invalid Credentials"});
        }

        const payload = {
            user: {
                id: user.id
            }
        }


        await jwt.sign(payload, jwtSecret, { expiresIn: '360000'}, (err, token) =>{
            if(err) throw err;
            res.status(200).json({ token: token})
        })
        
    } catch(err){
        console.log(err.message)
        res.status(500).send('Server Error');
    }

});

module.exports = router;