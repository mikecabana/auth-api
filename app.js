if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

// imports
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.COSMOS_DB_CS)
.then(
    () => {
        console.log('Succesfully connected to CosmosDB');
    },
    (err) => {
        console.log('CosmosDB connection error: ', err);
    }
);

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(morgan('dev')); //f or debug logging
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// prevent CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

// define routes
const authRoute = require('./routes/authorize').router;
const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');
const fileUploadRoute = require('./routes/file-upload');

app.use('/authorize', authRoute);
app.use('/users', usersRoute);
app.use('/events', eventsRoute);
app.use('/documents', fileUploadRoute);

// to test api is working
app.get('/', (req, res) => {
    res.status(200).json({
        message: "api is running",
        routes: ['/users', '/events', '/authorize', '/authorize/token', '/authorize/test']
    });
});

// error handling
app.use((req, res, next) => {
    const error = Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '...');
});