if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const eventRoutes = require('./api/routes/events');
const userRoutes = require('./api/routes/users');

// const jwt = require('jsonwebtoken');

const server = express();
const PORT = process.env.PORT || 3000;

server.use(morgan('dev'));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// handle CORS errors
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Authorization');
    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// routes
server.use('/events', eventRoutes);
server.use('/users', userRoutes);

// error handling for not found
server.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//error handling for everything else
server.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

// test to see if api is working
server.get('/api', (req, res) => {
    res.json({
        data: "Api route"
    });
});

// server.post('/api/login', (req, res) => {
//     // authenticate the user
//     const user = { id: 1 };
//     const token = jwt.sign({ user }, 'my_secret');
//     res.json({
//         token
//     });
// });

// const authorize = (req, res, next) => {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     }
//     else {
//         res.sendStatus(403);
//     }
// }

// server.get('/api/protected', authorize, (req, res) => {
//     jwt.verify(req.token, 'my_secret', (err, data) => {
//         if (err) {
//             res.sendStatus(403);
//         } else {
//             res.json({
//                 label: "Protected route",
//                 token: req.token,
//                 data: data
//             });
//         }
//     });

// });

server.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '...');
});