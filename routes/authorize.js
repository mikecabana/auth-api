const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = require('./mock/users');

const authorize = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, 'my_secret', (error, decoded) => {
            if (error) {
                error.status = 403;
                error.message = 'access_token has expired. please re-authenticate';
                next(error);
            }
            next();
        })
    }
    else {
        res.status(403);
    }
};

router.get('/', (req, res) => {

    res.status(200).json({
        message: 'validate user with post to /authorize/token'
    });

});

router.post('/token', (req, res) => {

    const user = users.filter(u => u.firstName === req.body.firstName && u.lastName === req.body.lastName)[0];

    if (user) {
        const token = jwt.sign({ user }, 'my_secret', {
            expiresIn: '5s'
        });

        res.status(201).json({
            token,
            user
        });
    } else {
        res.status(401).json({
            message: "could not authenticate user"
        });
    }
});

router.get('/test', authorize, (req, res) => {
    res.status(200).json({
        message: 'access granted'
    });
});

module.exports = { router, authorize };