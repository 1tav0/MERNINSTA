const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../keys');
const User = require('../models/User');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //authorization = Bearer asndjfbadjnfkanfkancdank...
  if (!authorization) {
    return res.status(401).json({error: "You must be logged in"})
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, JWT_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({error: "You must be logged in"})
    }

    const { _id } = payload;
    User.findById(_id)
      .then(userData => {
        req.user = userData;
        next();
      })
  })
}