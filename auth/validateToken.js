const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

// we create a middleware to protect our privates endpoints
const validateToken = (req, res ,next) => {
    const authHeader = req.headers["authorization"]; 
    const token = authHeader ? authHeader.split(" ")[1] : null; // we splite here bearer from the token then we take our token
    if (token == null) {
        res.status(400).send("Token not present");
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) { 
                res.status(401).send("Token invalid")
            } else {
                const userDB = await UserModel.findById(user.id);
                req.user = userDB;
                next(); //proceed to the next action in the calling function
            }
        });

    }
};

module.exports = validateToken;