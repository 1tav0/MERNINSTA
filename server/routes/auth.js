const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('hello')
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) { //since we dont want to procceed if we encounter this error we return 
        return res.status(422).json({ error: "Please add all the fields" });
    }

    res.json({ message: "Successfully posted" });
})

module.exports = router