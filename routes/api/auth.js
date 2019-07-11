const express = require('express');
const router = express.Router();

// @ route GET 
// @ desc : get user list
// @access Public 
router.get('/', (req, res) => {res.send('Auth api working fine')});

module.exports = router;