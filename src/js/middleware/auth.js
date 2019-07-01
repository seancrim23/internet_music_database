const jwt = require('jsonwebtoken');
const User = require('../model/user');

const auth = async (req, res, next) => {
    try{
        /**
         * 1. header brings in the token
         * 2. jwt verifies the token against the user secret to get the decoded _id
         * 3. then using the user model we search for a user with the decoded _id and the
         * auth token that was passed to the header (we use the decoded id because the token is generated
         * based on the ID of the user!!!)
         * 4. if no results, error, if results we pass the user object and token to the request 
         * and allow the request to finish
         */


        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if(!user){
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(401).send({ error: 'Please authenticate!' });
    }
};

module.exports = auth;