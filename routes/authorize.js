const router = require('express').Router();

router.get('/', (req, res, next) => {

    res.statusCode(200).json({
        message: 'validate user with post to /authorize/token'
    });

});

router.post('/authorize/token', (req, res) => {
    // authenticate the user
    const user = req.body;

    if (user) {
        const token = jwt.sign({ user }, 'my_secret');
        res.sendStatus(201).json({
            token
        });
    } else {
        res.sendStatus(401);
    }
    
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
};

router.get('/authorize/test', authorize, (req, res, next) => {
    res.sendStatus(201).json({
        message: 'access granted'
    });
});

module.exports = { router, authorize };