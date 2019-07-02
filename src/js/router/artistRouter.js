const express = require('express');
const Artist = require('../model/artist');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/artists', auth, async (req, res) => {
    var artist = await Artist.findOne({ name: req.body.name });
    try{
        //authenticated user checks if artist exists
        //populates the artist if it exists, if it doesnt exist create
        //new object and save it

        if(!artist){
            artist = new Artist(req.body);
            await artist.save();
        }

        //have to save the album to the authenticated user
        //and save the user
        if(!req.user.favArtists.includes(artist._id)){
            req.user.favArtists.push(artist._id);
            await req.user.save();
            res.status(201).send(`${artist.name} added to ${req.user.username} collection!`);
        }else{
            res.status(200).send(`${artist.name} already exists in ${req.user.username} collection!`);
        }
    }catch(e){
        res.status(400).send({ error: e });
    }
});

router.get('/artists/:id', auth, async (req, res) => {
    const artistId = req.params.id;

    try{
        const artist = await Artist.findOne({ _id: artistId });
        if(!artist){
            return res.status(404).send();
        }
        res.send(artist);
    }catch(e){
        res.status(400).send(e);
    }
});

router.get('/artists', auth, async (req, res) => {
    try{
        const favArtists = await Promise.all(req.user.favArtists.map(async (artistId) => {
            const artist = await Artist.findOne({ _id: artistId });
            if(artist){
                return artist;
            }
        }));
        res.send(favArtists);
    }catch(e){
        res.status(400).send(e);
    }
});

router.patch('/artists/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'genre'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid fields in body for update!' });
    }

    try{
        const artist = await Artist.findOne({ _id: req.params.id });
        updates.forEach(update => artist[update] = req.body[update]);
        await artist.save();

        res.send(artist);
    }catch(e){
        res.status(400).send(e);
    }
});

//deletes an album from the USER LIST of albums
router.delete('/artists/:id', auth, async (req, res) => {
    const artistId = req.params.id;
    const artistIndex = req.user.favArtists.indexOf(artistId);
    if(artistIndex === -1){
        return res.status(400).send({ error: 'Cannot find the artist ID!' });
    }
    req.user.favArtists.splice(artistIndex, 1);
    try{
        await req.user.save();
        res.send(req.user.favArtists);
    }catch(e){
        return res.status(400).send(e);
    }
    
});

module.exports = router;