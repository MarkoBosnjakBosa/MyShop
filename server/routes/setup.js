module.exports = function(app, models, smsEvent) {
    const User = models.User;
    app.get("/getAuthentication/:username", (request, response) => {
        var username = request.params.username;
        var query = {username: username};
        User.findOne(query).then(user => {
            response.status(200).json({authenticationEnabled: user.authenticationEnabled}).end();
        }).catch(error => console.log(error));
    });
    app.put("/setAuthentication", (request, response) => {
        var username = request.body.username;
        var authenticationEnabled = request.body.authenticationEnabled;
        var query = {username: username};
        var update = {};
        if(authenticationEnabled) {
            User.findOne(query).then(user => {
                var authenticationEnablingToken = request.body.authenticationEnablingToken;
                if(authenticationEnablingToken == user.authenticationEnablingToken) {
                    update = {authenticationEnabled: authenticationEnabled, authenticationEnablingToken: ""};
                    User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
                        response.status(200).json({valid: true, authenticationEnabled: updatedUser.authenticationEnabled}).end();
                    }).catch(error => console.log(error));
                }
                else {
                    var errorFields = ["authenticationEnablingToken"];
                    response.status(200).json({valid: false, errorFields: errorFields}).end();
                }
            }).catch(error => console.log(error));
        } else {
            update = {authenticationEnabled: authenticationEnabled};
            User.findOneAndUpdate(query, update, {new: true}).then(user => {
                response.status(200).json({valid: true, authenticationEnabled: user.authenticationEnabled}).end();
            }).catch(error => console.log(error));
        }
    });
    app.put("/sendAuthenticationEnablingToken", (request, response) => {
        var username = request.body.username;
        var query = {username: username};
        var authenticationEnablingToken = Math.floor(100000 + Math.random() * 900000);
        var update = {authenticationEnablingToken: authenticationEnablingToken};
        User.findOneAndUpdate(query, update, {new: true}).then(user => {
            //smsEvent.emit("sendAuthenticationEnablingToken", user.mobileNumber, user.firstName, user.authenticationEnablingToken);
            response.status(200).json({authenticationEnablingTokenSent: true}).end();
        }).catch(error => console.log(error));
    });
}