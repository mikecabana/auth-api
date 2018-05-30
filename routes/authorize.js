const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = require('./mock/users');

const authorize = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    
    if (bearerHeader !== undefined) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, 'my_secret', (error, decoded) => {
            if (error) {
                error.status = 403;
                error.message = 'access_token has expired. please re-authenticate';
                next(error);
            }
        });
        
        next();
    }
    else {
        res.sendStatus(403);
    }
};

router.get('/', (req, res) => {

    res.status(200).json({
        message: 'validate user with post to /authorize/token and a body containing userName and password like below',
        body: {
            userName: 'jdoe',
            password: 'password'
        }
    });

});

router.post('/token', (req, res) => {

    const user = users.filter(u => u.userName === req.body.userName && u.password === req.body.password)[0];

    if (user) {
        const token = jwt.sign({ user }, 'my_secret', {
            expiresIn: '7d'
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