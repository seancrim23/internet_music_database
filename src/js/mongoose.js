const mongoose = require('mongoose');

const dbConnect = () => {
    return mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
};

module.exports = {
    dbConnect
};