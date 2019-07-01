const express = require('express');
const path = require('path');
const { dbConnect } = require('./js/mongoose');
const userRouter = require('./js/router/userRouter');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

dbConnect().then(() => {
    console.log('Successfully connected to the MongoDB instance.');
    app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });
});