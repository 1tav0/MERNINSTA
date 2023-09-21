const express = require('express')
const app = express();
const PORT = 5000;
const mongoose = require('mongoose')
const { MongoUrl } = require('./keys')

mongoose.connect(MongoUrl)
    .then(() => console.log("connected to db successfully"))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})