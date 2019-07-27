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


// @ Route  GET api/profile
// @ desc   Get all profile
// @ access Private 
router.get('/', auth, async (req, res) => {

    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar', 'email']);

        if(!profiles){
            return res.status(404).json({msg : " No record found"})
        }
        console.log('ok')

        res.json(profiles);

    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
});


// @ Route  GET api/profile/user/id
// @ desc   Get user profile by id
// @ access Public
router.get('/user/:user_id', async(req, res) =>{

    try{
        const profile  = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar', 'email']);

        if(!profile){
            return res.status(404).json({msg : "profile Not Found"});
        }

        res.json(profile)
    }catch(err){

        if(err.kind == "ObjectId"){
            return res.status(404).json({msg : "profile Not Found"});
        }
        console.log(err.message);
        res.status(500).json({ msg: err.message});
    }
});


// @ Route  Delete api/profile/
// @ desc   Delete current user profile
// @ access Private
router.delete('/', auth, async (req, res) => {
    try{
        //@todo delete users posts

        //delete profile
        await Profile.findOneAndDelete({ user: req.user.id});

        //delete user
        await User.findOneAndDelete({ _id: req.user.id });

        res.json({ msg: "Account Deleted" })
    }catch(err){
        console.log(err.message);
        res.status(500).json({ msg: "Server Error"});
    }
});


// @ Route  PUT api/profile/experience
// @ desc   Update current user profile experience
// @ access Private
router.put('/experience', [auth, 
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('location', 'location is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
] , async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors : errors.array()})
    }

    const { title, from, company,  location, to , current, description  } = req.body;

    const newExp = { title, company, location, from, to , current, description  }

    try {
        
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({msg: "Server Error"})
    }

});

// @ Route  PUT api/profile/education
// @ desc   Update current user profile education
// @ access Private
router.put('/education', [auth, 
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'field of study is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
] , async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors : errors.array()})
    }

    const {  school, degree, fieldofstudy, from, to, current, description  } = req.body;

    const newEdu = {  school, degree, fieldofstudy, from, to, current, description }

    try {
        
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({msg: "Server Error"})
    }

});
// @ Route  Delete api/profile/experience/:exp_id
// @ desc   Delete profile experience by Id
// @ access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id});
       // console.log(profile.experience)
        //get index of exp to remove
        const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.id);
        //res.json(removeIndex);
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: "Server Error"});
    }
});

module.exports = router;