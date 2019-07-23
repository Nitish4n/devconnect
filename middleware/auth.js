const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

module.exports =  (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(404).json({ msg : "Token Not Found"});
    }

    try{
        //decode token
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded.user;
        next();
    }catch(err){
        return res.status(400).send('Invalid Token');
    }



} 
