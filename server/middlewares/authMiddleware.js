const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    // First, check the Authorization header
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader) {
        token = authHeader.split(' ')[1];  // Extract token from Authorization header
    } else if (req.cookies) {
        // If no Authorization header, check for the token in cookies
        console.log("COOKIE_TOKEN", req.cookies);
        token = req.cookies.token;  // Extract token from cookie
    }

    if (!token) {
        return res.sendStatus(401); // Unauthorized, no token found
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden, invalid token
        }

        // Attach the user information (decoded from JWT) to the request
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateJWT;