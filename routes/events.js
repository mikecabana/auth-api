const express = require('express');
const router = express.Router();

const authorize = require('./authorize').authorize;

router.get('/', authorize, (req, res) => {
    
    res.status(200).json({
        message: 'events all get endpoint'
    });

});

router.get('/:id', authorize, (req, res) => {

    res.status(200).json({
        message: 'events single get endpoint'
    });

});

router.post('/', authorize, (req, res) => {

    res.status(201).json({
        message: 'event post endpoint'    
    });

});

router.put('/:id', authorize, (req, res) => {

    res.status(200).json({
        message: 'event put endpoint'
    });

});

router.delete('/:eventId', authorize, (req, res) => {
    
    res.status(204).json({
        message: 'event delete endpoint',
        id
    });

});

router.delete('/:id', authorize, (req, res) => {
    res.status(204).json();
});

module.exports = router;