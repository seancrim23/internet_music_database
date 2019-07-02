const express = require('express');
const path = require('path');
const { dbConnect } = require('./js/mongoose');
const userRouter = require('./js/router/userRouter');
const albumRouter = require('./js/router/albumRouter');
const artistRouter = require('./js/router/artistRouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(albumRouter);
app.use(artistRouter);

dbConnect().then(() => {
    console.log('Successfully connected to the MongoDB instance.');
    app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });
});