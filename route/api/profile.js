const express = require('express');
const router = express.Router();
const auth = require('./../../middleware/auth');
const Profile = require('../../modal/Profile');
const User = require('../../modal/User');
const { check, validationResult } = require('express-validator');

// @Route api/profile/me
// @desc  get current profile
// @Access Private
router.get('/me', auth , async (req, res) => {
    
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


// @Route api/profile/
// @desc  create or update profile
// @Access Private
router.post('/', [auth, 
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),

    ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { company, 
        website, 
        location, 
        status, 
        skills, 
        bio, 
        githubusername, 
        experience, 
        education,
        youtube, 
        twitter, 
        facebook, 
        linkedin, 
        instagram} = req.body;


        const profileFields = {};

        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(status) profileFields.status = status;
        if(skills){
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        if(bio) profileFields.bio = bio;
        if(githubusername) profileFields.githubusername = githubusername;
        // if(experience) profileFields.experience = experience;
        // if(education) profileFields.education = education;

        profileFields.social = {};
        if(youtube) {
            profileFields.social.youtube = youtube;
        }

        if(twitter) {
            profileFields.social.twitter = twitter;
        }

        if(facebook) {
            profileFields.social.facebook = facebook;
        }
        if(linkedin) {
            profileFields.social.linkedin = linkedin;
        }
        if(instagram) {
            profileFields.social.instagram = instagram;
        }

    try{
        let profile= await Profile.findOne({ user: req.user.id});

        if(profile){
            //update profile
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id},
                {$set: profileFields},
                {new: true});

            return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();

        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error')
    }

    res.send('ok')
});



module.exports = router;