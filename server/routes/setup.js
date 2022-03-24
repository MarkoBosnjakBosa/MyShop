module.exports = function(app, models, smsEvents, checkStatus, validations) {
    const User = models.User;
    app.get("/getAuthentication/:username", checkStatus.isLoggedIn, (request, response) => {
        var username = request.params.username;
        var query = {"account.username": username};
        User.findOne(query).then(user => {
            response.status(200).json({authenticationEnabled: user.confirmation.authenticationEnabled}).end();
        }).catch(error => console.log(error));
    });
    app.put("/setAuthentication", [checkStatus.isLoggedIn, validations.validateAuthenticationEnabling], (request, response) => {
        var username = request.body.username;
        var authenticationEnabled = request.body.authenticationEnabled;
        var query = {"account.username": username};
        var update = {};
        var options = {new: true};
        if(authenticationEnabled) {
            User.findOne(query).then(user => {
                var authenticationEnablingToken = request.body.authenticationEnablingToken;
                if(authenticationEnablingToken === user.confirmation.authenticationEnablingToken) {
                    update = {"confirmation.authenticationEnabled": authenticationEnabled, "confirmation.authenticationEnablingToken": ""};
                    User.findOneAndUpdate(query, update, options).then(updatedUser => {
                        response.status(200).json({valid: true, authenticationEnabled: updatedUser.confirmation.authenticationEnabled}).end();
                    }).catch(error => console.log(error));
                } else {
                    response.status(200).json({valid: false, errors: ["authenticationEnablingToken"]}).end();
                }
            }).catch(error => console.log(error));
        } else {
            update = {"confirmation.authenticationEnabled": authenticationEnabled};
            User.findOneAndUpdate(query, update, options).then(user => {
                response.status(200).json({valid: true, authenticationEnabled: user.confirmation.authenticationEnabled}).end();
            }).catch(error => console.log(error));
        }
    });
    app.put("/sendAuthenticationEnablingToken", checkStatus.isLoggedIn, (request, response) => {
        var username = request.body.username;
        var query = {"account.username": username};
        var authenticationEnablingToken = Math.floor(100000 + Math.random() * 900000);
        var update = {"confirmation.authenticationEnablingToken": authenticationEnablingToken};
        var options = {new: true};
        User.findOneAndUpdate(query, update, options).then(user => {
            smsEvents.emit("sendAuthenticationEnablingToken", user.account.mobileNumber, user.account.firstName, user.confirmation.authenticationEnablingToken);
            setTimeout(function() { deleteAuthenticationEnablingToken(user.account.username); }, 5 * 60 * 1000);
            response.status(200).json({authenticationEnablingTokenSent: true}).end();
        }).catch(error => console.log(error));
    });

    function deleteAuthenticationEnablingToken(username) {
        var query = {"account.username": username};
        var update = {"confirmation.authenticationEnablingToken": ""};
        var options = {new: true};
        User.findOneAndUpdate(query, update, options).then().catch(error => console.log(error));
    }
}