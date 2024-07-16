const { expressjwt } = require('express-jwt');
const { JWT_SECRET } = require('../configs/env');


module.exports = jwt;

function jwt() {
    return expressjwt(
        { 
            secret:JWT_SECRET,
            algorithms: ['HS256'],
            onExpired: async (req, err) => {
                if (new Date() - err.inner.expiredAt < 5000) { return;}
                throw err;
            }
        }
    )
    .unless({
        path: [
            // public routes that don't require authentication
            '/api/auth/login',
            '/api/auth/register',
            '/api/uploads/default'
            ]
    })
}