const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/users');


router.post('/', (req, res) => {

    UserModel
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'authorization failed'
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'authorization failed'
                        });
                    }
                    if (result) {

                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                id: user[0]._id
                            },
                            process.env.JWT_SECRET_KEY,
                            {
                                expiresIn: '1h'
                            });

                        return res.status(200).json({
                            message: 'authorization successful',
                            token
                        });
                    }
                    res.status(401).json({
                        message: 'authorization failed'
                    });
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            });
        });
});


const authorize = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader !== undefined) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                error.status = 401;
                error.message = 'access_token has expired. please re-authenticate';
                next(error);
            }
        });

        next();
    }
    else {
        res.sendStatus(401);
    }
};

router.get('/', (req, res) => {

    res.status(200).json({
        message: 'validate user with post to /authorize and a body containing email and password like below',
        body: {
            email: 'johndoe@example.com',
            password: 'a-password'
        }
    });

});


router.get('/test', authorize, (req, res) => {
    res.status(200).json({
        message: 'authorization successful'
    });
});

module.exports = { router, authorize };