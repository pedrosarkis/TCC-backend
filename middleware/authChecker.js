'use strict';
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(404).json({
            auth: false,
            message: 'Missing Authorization Header',
        });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            // return res.status(500).json({
            //     auth:false,
            //     message: 'Invalid Token',
            // });
            return res.status(500).json({
                err
            })
        }
        // req.userId = decoded.id;
        next();
    });
};

module.exports = verifyJWT;
