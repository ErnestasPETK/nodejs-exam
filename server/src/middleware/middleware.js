const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

module.exports = {
    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1]
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ err: "Invalid authorization token" })
                }
                req.user = decoded;
                next();
            });
        }
        catch (err) {
            return res.status(401).send({ err: "You are not logged in" });
        }
    }
}