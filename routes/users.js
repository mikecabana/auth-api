const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const authorize = require('../middleware/authorize-route');


const UserModel = require('../models/users');


router.get('/', authorize, (req, res) => {

    UserModel
        .find()
        .select('-__v')
        .exec()
        .then((docs) => {

            const response = {
                count: docs.length,
                items: docs
            }
            res
                .status(200)
                .json(response);
        })
        .catch((err) => {
            res
                .status(500)
                .json({
                    error: err
                });
        });
});

router.get('/:id', authorize, (req, res) => {

    const userId = req.params.id;

    UserModel
        .findById(userId)
        .select('-__v')
        .exec()
        .then((doc) => {
            if (doc) {
                res
                    .status(200)
                    .json(doc);
            } else {
                res
                    .status(404)
                    .json({
                        message: `No valid user with id: ${userId}`
                    });
            }
        })
        .catch((err) => {
            res
                .status(500)
                .json({
                    error: err
                });
        });
});

router.post('/', authorize, (req, res) => {

    UserModel.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'account exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new UserModel({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            role: req.body.role,
                            creationTimeStamp: new Date().toISOString()
                        });

                        user
                            .save()
                            .then((result) => {
                                res
                                    .status(201)
                                    .json(result);
                            })
                            .catch((err) => {
                                res
                                    .status(500)
                                    .json({
                                        error: err
                                    });
                            });
                    }
                });
            }
        });


});

router.patch('/:id', authorize, (req, res) => {

    const userId = req.params.id;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.key] = ops.value;
    }

    UserModel
        .update({ _id: userId }, { $set: updateOps })
        .exec()
        .then((result) => {
            res
                .status(200)
                .json(result);
        })
        .catch((err) => {
            res
                .status(500)
                .json({
                    error: err
                })
        });
});

router.delete('/:id', authorize, (req, res) => {

    const userId = req.params.id;

    UserModel
        .remove({
            _id: userId
        })
        .exec()
        .then((result) => {

            let status;

            if (result.n !== 0) {
                status = 204;
            } else {
                status = 404
            }

            res
                .status(status)
                .json({
                    message: 'no user found'
                });
        })
        .catch((err) => {
            res
                .status(500)
                .json({
                    error: err
                });
        });
});

module.exports = router;