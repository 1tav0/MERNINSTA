const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../keys')
const requireLogin = require('../middleware/requireLogin')

// router.get('/protected', requireLogin, (req, res) => {
//     res.send("hello user");
// })

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) { //since we dont want to procceed if we encounter this error we return
        return res.status(422).json({ error: "Please add all the fields" });
    }

    bcrypt.hash(password, 12)
        .then((hashedpassword) => {
            User.findOne({ email: email })
            .then((savedUser) => {
                if (savedUser) {
                    return res.status(422).json({ error: "User with the email already exits"})
                }
                const user = new User({
                    name,
                    email,
                    password: hashedpassword
                })

                user.save()
                    .then((user) => {
                        res.json({message: "User saved Successfully"})
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
        })
        .catch((error) => {
            console.log(error);
        })
})



router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(422).json({error: "please add email or password"})
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or Password!" })
            }
            bcrypt.compare(password, savedUser.password)
                .then((doMatch) => {
                    if (doMatch) {
                        // res.json({message: "Successfully signed in"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_KEY);
                        const { _id, name, email } = savedUser;
                        res.json({ token: token, user:{_id, name, email} });
                    } else {
                        return res.status(422).json({error: "Invalid Email or Password!"})
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        })
})

module.exports = router