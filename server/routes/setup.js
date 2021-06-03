module.exports = function(app, models, smsEvent) {
    const User = models.User;
    app.get("/getAuthentication/:username", (request, response) => {
        var username = request.params.username;
        var query = {"account.username": username};
        User.findOne(query).then(user => {
            response.status(200).json({authenticationEnabled: user.confirmation.authenticationEnabled}).end();
        }).catch(error => console.log(error));
    });
    app.put("/setAuthentication", (request, response) => {
        var username = request.body.username;
        var authenticationEnabled = request.body.authenticationEnabled;
        var query = {"account.username": username};
        var update = {};
        if(authenticationEnabled) {
            User.findOne(query).then(user => {
                var authenticationEnablingToken = request.body.authenticationEnablingToken;
                if(authenticationEnablingToken == user.confirmation.authenticationEnablingToken) {
                    update = {"confirmation.authenticationEnabled": authenticationEnabled, "confirmation.authenticationEnablingToken": ""};
                    User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
                        response.status(200).json({valid: true, authenticationEnabled: updatedUser.confirmation.authenticationEnabled}).end();
                    }).catch(error => console.log(error));
                }
                else {
                    response.status(200).json({valid: false, errorFields: ["authenticationEnablingToken"]}).end();
                }
            }).catch(error => console.log(error));
        } else {
            update = {"confirmation.authenticationEnabled": authenticationEnabled};
            User.findOneAndUpdate(query, update, {new: true}).then(user => {
                response.status(200).json({valid: true, authenticationEnabled: user.confirmation.authenticationEnabled}).end();
            }).catch(error => console.log(error));
        }
    });
    app.put("/sendAuthenticationEnablingToken", (request, response) => {
        var username = request.body.username;
        var query = {"account.username": username};
        var authenticationEnablingToken = Math.floor(100000 + Math.random() * 900000);
        var update = {"confirmation.authenticationEnablingToken": authenticationEnablingToken};
        User.findOneAndUpdate(query, update, {new: true}).then(user => {
            //smsEvent.emit("sendAuthenticationEnablingToken", user.account.mobileNumber, user.account.firstName, user.confirmation.authenticationEnablingToken);
            response.status(200).json({authenticationEnablingTokenSent: true}).end();
        }).catch(error => console.log(error));
    });
}