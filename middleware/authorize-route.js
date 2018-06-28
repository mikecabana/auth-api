const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {    
    try {
        const bearerToken = req.header('Authorization').split(' ');
        const token = bearerToken[1];
        const decode = jwt.decode(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (e) {
        return res.status(401).json({
            message: 'unauthorized'
        });
    }
}