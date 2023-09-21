const express = require('express')
const app = express();
const PORT = 5000;

const customMiddleWare = (req,res,next) => {
    console.log("middleware executed!!!")
    next();
}

// app.use(customMiddleWare);

app.get('/', customMiddleWare, (req, res) => {
    console.log("home");
    res.send("Hello World")
})


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})