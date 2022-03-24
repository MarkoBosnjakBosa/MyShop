const validationFunctions = require("../helpers/validations.js");

module.exports = function(models, validations) {
    const User = models.User;
    function isAdmin(request, response, next) {
        var username = request.headers["application-user"];
        if(!validationFunctions.invalidUsername(username)) {
            var query = {"account.username": username};
            User.findOne(query).then(user => {
                if(!validations.isEmpty(user)) {
                    if(user.account.isAdmin) next();
                    else response.status(200).json({isAdmin: false}).end();
                } else {
                    response.status(200).json({isAdmin: false}).end();
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({isAdmin: false}).end();
        }
    }
    return {isAdmin: isAdmin};
}