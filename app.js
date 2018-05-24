if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }

const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const authRoute = require('./routes/authorize').router;
const usersRoute = require('./routes/users');

app.use('authorize', authRoute);
app.use('users', usersRoute)

app.use(express.json());  

app.get('/api', (req, res, next) => {
    res.status(200).json({
        message: "api is running",
        routes: ['/users', '/authorize/token', '/authorize/test']
    });
});


app.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '...');
});