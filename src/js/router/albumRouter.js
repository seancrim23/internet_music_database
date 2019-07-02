const express = require('express');
const Album = require('../model/album');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/albums', auth, async (req, res) => {
    var album = await Album.findOne({ title: req.body.title });
    try{
        //authenticated user checks if album exists
        //populates the album if it exists, if it doesnt exist create
        //new object and save it

        if(!album){
            album = new Album(req.body);
            await album.save();
        }

        //have to save the album to the authenticated user
        //and save the user
        if(!req.user.favAlbums.includes(album._id)){
            req.user.favAlbums.push(album._id);
            await req.user.save();
            res.status(201).send(`${album.title} added to ${req.user.username} collection!`);
        }else{
            res.status(200).send(`${album.title} already exists in ${req.user.username} collection!`);
        }
    }catch(e){
        res.status(400).send({ error: e });
    }
});

router.get('/albums/:id', auth, async (req, res) => {
    const albumId = req.params.id;

    try{
        const album = await Album.findOne({ _id: albumId });
        if(!album){
            return res.status(404).send();
        }
        res.send(album);
    }catch(e){
        res.status(400).send(e);
    }
});

router.get('/albums', auth, async (req, res) => {
    try{
        const favAlbums = await Promise.all(req.user.favAlbums.map(async (albumId) => {
            const album = await Album.findOne({ _id: albumId });
            if(album){
                return album;
            }
        }));
        res.send(favAlbums);
    }catch(e){
        res.status(400).send(e.stack);
    }
});

router.patch('/albums/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'artist'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid fields in body for update!' });
    }

    try{
        const album = await Album.findOne({ _id: req.params.id });
        updates.forEach(update => album[update] = req.body[update]);
        await album.save();

        res.send(album);
    }catch(e){
        res.status(400).send(e);
    }
});

//deletes an album from the USER LIST of albums
router.delete('/albums/:id', auth, async (req, res) => {
    const albumId = req.params.id;
    const albumIndex = req.user.favAlbums.indexOf(albumId);
    if(albumIndex === -1){
        return res.status(400).send({ error: 'Cannot find the album ID!' });
    }
    req.user.favAlbums.splice(albumIndex, 1);
    try{
        await req.user.save();
        res.send(req.user.favAlbums);
    }catch(e){
        return res.status(400).send(e);
    }
    
});

module.exports = router;