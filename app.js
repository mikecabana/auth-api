if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

const authRoute = require('./routes/authorize').router;
const usersRoute = require('./routes/users');

app.use('/authorize', authRoute);
app.use('/users', usersRoute)

// app.use(express.json());

// app.use(function (req, res, next) {
//     res.status(404).send('404 - Not Found!');
// });

// app.use(function (err, req, res, next) {
//     res.status(500).send('500 - Something went wrong!');
// });

app.get('/api', (req, res, next) => {
    res.status(200).json({
        message: "api is running",
        routes: ['/users', '/authorize', '/authorize/token', '/authorize/test']
    });
});


app.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '...');
});