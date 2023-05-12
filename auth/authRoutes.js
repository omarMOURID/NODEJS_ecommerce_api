const jwt = require('jsonwebtoken');
const express = require('express');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

let refreshTokens = [];


// create the login end point using jwt
router.post("/login", async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await UserModel.findOne({email: email}).exec();
        if (user && bcrypt.compareSync(password, user.hashPassword)) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            res.status(201).json({accessToken, refreshToken});
        } else {
            throw new Error("email or password Incorrect!");
        }
    } catch(error) {
        res.status(401).json(error.message ? {message: error.message} : error);
    }
});

///refresh token api
router.post("/refreshToken", async (req, res) => {
    const token = req.body.token;

    if (!refreshTokens.includes(token)){
        res.status(400).send("Refresh Token Invalid");
    } else {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) { 
                // if the token expire we send an invalide token
                res.status(401).send("Token invalid")
            } else {
                // we refresh the tokens and send back the tokens
                refreshTokens = refreshTokens.filter( (t) => t !== token );
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                res.status(200).send({accessToken, refreshToken});
            }
        });
    }
});

//logout
router.delete("/logout", (req,res)=>{
    const token = req.body.token;
    refreshTokens = refreshTokens.filter( (t) => t !== token)
    //remove the old refreshToken from the refreshTokens list
    res.status(204).send("Logged out!")
});

//generate access token
const generateAccessToken = (user) => {
    return jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 10 * 60})
};

//generate refresh token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({id: user.id, role: user.role}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 15 * 60});
    refreshTokens.push(refreshToken);
    return refreshToken;
};

module.exports = router;