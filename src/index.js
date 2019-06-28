const express = require('express');
const path = require('path');
const { dbConnect } = require('./js/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

dbConnect().then(() => {
    console.log('Successfully connected to the MongoDB instance.');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});