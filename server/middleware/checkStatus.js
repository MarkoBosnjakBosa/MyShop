const jwt = require("jsonwebtoken");

function isLoggedIn(request, response, next) {
    try {
        var token = request.headers.authorization.split(" ")[1];
        var decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        request.userData = decodedToken;
        next();
    } catch(error) {
        response.status(200).json({loggedIn: false}).end();
    }
}

module.exports = {isLoggedIn: isLoggedIn};