const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling get requests for events'
    });
});

router.post('/', (req, res, next) => {

    const event = {
        name: req.body.name
    };

    res.status(201).json({
        message: 'Handling post requests for events',
        event
    });
});

// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

router.get('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    res.status(200).json({
        message: 'Handling get requests for a specific event using its id',
        id
    });

});

router.patch('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    res.status(200).json({
        message: 'Handling patch requests for a specific event using its id',
        id
    });
});

router.delete('/:eventId', (req, res, next) => {
    const id = req.params.eventId;
    res.status(200).json({
        message: 'Handling delete requests for a specific event using its id',
        id
    });
});


module.exports = router;