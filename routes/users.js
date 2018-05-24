const router = require('express').Router();

router.get('/api/users', (req, res) => {
    const queryString = `select * from users`;

    db.queryDb(queryString, res);      
});

router.get('/api/user', (req, res) => {
    const userId = req.query.id;
    const queryString = `select * from users where id = '${userId}'`;

    db.queryDb(queryString, res);      
});

router.post('/api/users/create', (req, res) => {
    const user = req.body;
    const queryString = `insert into users (fullName, email, password) values ('${user.fullName}', '${user.email}', '${user.password}')`;

    db.queryDb(queryString, res);      
});

router.delete('/api/user/delete', (req, res) => {
    const userId = req.query.id;
    const queryString = `delete from users where id = '${userId}'`;

    db.queryDb(queryString, res); 
});

module.exports = router;