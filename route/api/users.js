const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../modal/User');
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');


// @ route /user/test
// @ access public
// @ desc User test route

router.get('/test', (req, res) => {
    res.send('Test User working');
})


router.post('/create', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Min length is 5').isLength({min: 5})
] , async (req, res) => {


    console.log('11');
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
    }
    const { name, email, password } = req.body;
    console.log('12');
    try{
        //check user exist
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).send('exist');
        }
        
        const avatar = gravatar.url(email ,  {s: '100', r: 'x', d: '404'});
        //create user instance
        user = new User({
            name,
            email,
            password,
            avatar
        });
        
        //generate salt
        const salt = await bcryptjs.genSalt(10);

        user.password= await bcryptjs.hash(password, salt);

        await user.save();

        console.log('user created')
    } catch(err){
        console.log(err.message)
        res.status(500).send('Server Error');
    }

});


module.exports = router;