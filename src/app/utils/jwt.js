const { expressjwt: expressJwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.SECRET;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ["HS256"],
        isRevoked: isRevokedCallback,
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] },
            { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] },
            {
                url: /\/api\/v1\/orders(.*)/,
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            },
            {
                url: /\/api\/v1\/users(.*)/,
                methods: ["GET", "POST", "PUT", "OPTIONS"],
            },
            `${api}/users/login`,
            `${api}/users/register`,
        ],
    });
}

const isRevokedCallback = async (req, token) => {
    const isAdmin = token.payload.isAdmin;
    const tokenId = token.payload.jti;
    const tokenUser = await data.getRevokedToken(isAdmin, tokenId);
    return tokenUser !== "undefined";
};

module.exports = authJwt;
