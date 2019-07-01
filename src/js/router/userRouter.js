const express = require('express');
const User = require('../model/user');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body);

    try{
        const token = await user.generateAuthToken();
        await user.save();

        res.status(201).send({ user, token });
    }catch(e){
        res.status(400).send({ error: 'Error with signup!' });
    }
});

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByUsername(req.body.username, req.body.password);
        await user.generateAuthToken();
        res.status(200);
    }catch(e){
        res.status(400).send({ error: 'Error with login!' });   
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token != req.token;
        });

        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send({ error: 'Error with logout!' });
    }
});

module.exports = router;