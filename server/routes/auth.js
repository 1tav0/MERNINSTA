const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res) => {
    res.send('hello')
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) { //since we dont want to procceed if we encounter this error we return 
        return res.status(422).json({ error: "Please add all the fields" });
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                res.status(422).json({ error: "User with the email already exits"})
            }
            const user = new User({
                name,
                email, 
                password
            })

            user.save()
                .then((user) => {
                    res.json({message: "User saved Successfully"})
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })
        
})

module.exports = router