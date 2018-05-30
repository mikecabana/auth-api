const express = require('express');
const router = express.Router();

const authorize = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.sendStatus(403);
    }
};

router.get('/', (req, res, next) => {

    res.status(200).json({
        message: 'validate user with post to /authorize/token'
    });

});

router.post('/token', (req, res, next) => {
    // authenticate the user
    const user = req.body;

    console.log(req.body);
    

    if (user) {
        const token = jwt.sign({ user }, 'my_secret');
        res.status(201).json({
            token
        });
    } else {
        res.status(401).json({
            message: "could not authenticate user"
        });
    }
});

router.get('/test', authorize, (req, res, next) => {
    res.status(200).json({
        message: 'access granted'
    });
});

module.exports = {router, authorize};