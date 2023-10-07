const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const { MongoUrl } = require('./keys');
const User = require('./models/User');
const Post = require('./models/Post');

const AuthRoutes = require('./routes/auth');
const PostRoutes = require('./routes/post');
//middleWare
app.use(express.json()); //placing matters this is to read data from req.body
app.use(AuthRoutes);
app.use(PostRoutes)

mongoose.connect(MongoUrl)
    .then(() => console.log("connected to db successfully"))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})


