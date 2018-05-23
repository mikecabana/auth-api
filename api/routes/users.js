const express = require('express');
const router = express.Router();
const db = require('../../db/db');


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get users'
    });
    // const queryString = `select * from users`;

    // db.queryDb(queryString, res);      
});

router.post('/', (req, res, next) => {

    const user = {
        name: req.body.name
    };

    res.status(201).json({
        message: 'create users',
        user
    });
    // const user = req.body;
    // const queryString = `insert into users (fullName, email, password) values ('${user.fullName}', '${user.email}', '${user.password}')`;

    // db.queryDb(queryString, res);      
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'get user',
        id
    });
    // const userId = req.params.userId;
    // const queryString = `select * from users where id = '${userId}'`;

    // db.queryDb(queryString, res);      
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'delete user',
        id
    });
    // const userId = req.query.id;
    // const queryString = `delete from users where id = '${userId}'`;

    // db.queryDb(queryString, res); 
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    res.status(200).json({
        message: 'update user',
        id
    });
});

module.exports = router;