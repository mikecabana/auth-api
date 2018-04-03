if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');

const server = express();
const PORT = process.env.PORT || 3000;


server.use(express.json());  

server.get('/api', (req, res) => {
    res.json({
        data: "Api route"
    });
});

server.post('/api/login', (req, res) => {
    // authenticate the user
    const user = { id: 1 };
    const token = jwt.sign({ user }, 'my_secret');
    res.json({
        token
    });
});



server.get('/api/user', (req, res) => {
    const userId = req.query.id;
    const queryString = `select * from users where id = '${userId}'`;

    db.queryDb(queryString, res);      
});

server.get('/api/users', (req, res) => {
    const queryString = `select * from users`;

    db.queryDb(queryString, res);      
});

server.post('/api/users/create', (req, res) => {
    const user = req.body;
    const queryString = `insert into users (fullName, email, password) values ('${user.fullName}', '${user.email}', '${user.password}')`;

    db.queryDb(queryString, res);      
});

server.delete('/api/user/delete', (req, res) => {
    const userId = req.query.id;
    const queryString = `delete from users where id = '${userId}'`;

    db.queryDb(queryString, res); 
});



const authorize = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.sendStatus(403);
    }
}

server.get('/api/protected', authorize, (req, res) => {
    jwt.verify(req.token, 'my_secret', (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                label: "Protected route",
                token: req.token,
                data: data
            });
        }
    });
   
});

server.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '...');
});