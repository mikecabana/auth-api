const express = require('express');
const router = express.Router();

const users = require('./mock/users');

const authorize = require('./authorize').authorize;

router.get('/', authorize, (req, res) => {

    res.status(200).json({
        message: 'user all get endpoint',
        users
    });

});

router.get('/:id', authorize, (req, res) => {

    const userId = req.params.id;

    const user = users.filter(u => u.id.toString() === userId)[0];

    if (user) {
        res.status(200).json({
            user,
            message: 'user single get endpoint'
        });
    } else {
        res.status(404).json({
            message: `user with id ${userId} not found`
        });
    }
});

router.post('/', authorize, (req, res) => {

    const user = {
        id: users.length,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }

    users.push(user);

    res.status(201).json({
        message: 'user post endpoint',
        userCreated: user
    });
});

router.put('/:id', authorize, (req, res) => {

    const userId = req.params.id;

    const user = users.filter(u => u.id.toString() === userId)[0];

    updatedUser = Object.assign(user, {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    
    users[users.indexOf(user)] = updatedUser;

    res.status(200).json({
        message: 'user put endpoint',
        updatedUser
    });

});

router.delete('/:id', authorize, (req, res) => {

    const userId = req.params.id;

    const user = users.filter(u => u.id.toString() === userId)[0];

    users.splice(users.indexOf(user));

    res.status(204).json();

});

module.exports = router;