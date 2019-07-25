const express = require('express');
const router = express.Router();
const auth = require('./../../middleware/auth');
const Profile = require('../../modal/Profile');
const User = require('../../modal/User');

// @Route api/profile/
// @desc  get current profile
// @Access Private
router.get('/', auth , async (req, res) => {
    
    try{
        let userId = req.user.id;
        const profile = await Profile.findOne({ user: userId}).populate('user', ['name', 'avatar']);

        if(!profile){
            res.status(404).json({ msg: 'No profile FOund'});
        }

        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
});



module.exports = router;