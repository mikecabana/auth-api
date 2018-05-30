const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
    const queryString = `select * from users`;

    db.queryDb(queryString, res);      
});

router.get('/:id', (req, res, next) => {
    const userId = req.query.id;
    const queryString = `select * from users where id = '${userId}'`;

    db.queryDb(queryString, res);      
});

router.post('/', (req, res, next) => {
    const user = req.body;
    const queryString = `insert into users (fullName, email, password) values ('${user.fullName}', '${user.email}', '${user.password}')`;

    db.queryDb(queryString, res);      
});

router.delete('/', (req, res, next) => {
    const userId = req.query.id;
    const queryString = `delete from users where id = '${userId}'`;

    db.queryDb(queryString, res); 
});

module.exports = router;