const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authorize = require('./authorize').authorize;

const EventModel = require('../models/events');

router.get('/', authorize, (req, res) => {

    EventModel
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

    const eventId = req.params.id;

    EventModel
        .findById(eventId)
        .select('-__v')
        .exec()
        .then((doc) => {
            if (doc) {
                res
                    .status(200)
                    .json(doc);
            } else {
                res
                    .staus(404)
                    .json({
                        message: `No valid event with id: ${eventId}`
                    });

            }
        })
        .catch((err) => {
            res
                .status(500)
                .json({
                    error: err
                })
        });
});

router.post('/', authorize, (req, res) => {

    const eventModel = new EventModel({
        _id: new mongoose.Types.ObjectId(),
        label: req.body.label,
        site: req.body.site,
        location: req.body.location,
        date: new Date(req.body.date).toISOString(),
        employees: req.body.employees ? req.body.employees : new Array()
    });

    eventModel
        .save()
        .then((result) => {
            res
                .status(201)
                .json(req.body);
        })
        .catch((err) => {
            res
                .status(500)
                .json({
                    error: err
                });
        });
});

router.patch('/:id', authorize, (req, res) => {

    const eventId = req.params.id;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.key] = ops.value;
    }

    EventModel
        .update({ _id: eventId }, { $set: updateOps })
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
                });
        });
});

router.delete('/:id', authorize, (req, res) => {

    const eventId = req.params.id;

    EventModel.remove({
        _id: eventId
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
                    message: 'no event found'
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

router.patch('/:id/invite', authorize, (req, res) => {

    const eventId = req.params.id;
    const newInvites = req.body;

    EventModel
        .update({ _id: eventId }, { $push: { employees: { $each: newInvites } } }, { upsert: true })
        .exec()
        .then((result) => {
            res
                .status(202)
                .json(result);
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