const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @ route GET api/user
// @ desc : get user list
// @ access Public 
router.get('/', (req, res) => {res.send('Users api working fine')});



// @route POST api/user/register
// @desc  Register user
// access Public

router.post('/register', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please provide valid email').isEmail(),
    check('password', 'Password must be min 6 character').isLength({min: 6})
], (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({erros: errors});
    }
    console.log(req.body);
    res.send('Hello Register now');
})
module.exports = router;