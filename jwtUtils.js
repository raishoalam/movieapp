const jwt = require('jwt-simple');
const moment = require('moment');
const SECRET_KEY = process.env.JWT_SECRET;

const createToken = (user) => {
    const payload = {
        sub: user.id,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    };
    return jwt.encode(payload, SECRET_KEY);
};

const decodeToken = (token) => {
    try {
        const decoded = jwt.decode(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = { createToken, decodeToken };
