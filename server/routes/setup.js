module.exports = function(app, models) {
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
            var authenticationTestToken = Math.floor(100000 + Math.random() * 900000);
            update = {authenticationTestToken: authenticationTestToken};
            User.findOneAndUpdate(query, update, {new: true}).then(user => {
                //smsEvent.emit("sendAuthenticationTestseToken", updatedUser.mobileNumber, updatedUser.firstName, updatedUser.authenticationToken);
                response.status(200).json({authentication: true, valid: false, authenticationToken: true, username: user.username, isAdmin: updatedUser.isAdmin}).end();
            }).catch(error => console.log(error));
        } else {
            update = {authenticationEnabled: authenticationEnabled};
            User.findOneAndUpdate(query, update, {new: true}).then(user => {
                response.status(200).json({authenticationEnabled: user.authenticationEnabled}).end();
            }).catch(error => console.log(error));
        }
    });
    app.put("/confirmAuthentication", (request, response) => {
        var username = request.body.username;
        var query = {username: username};
        var update = {authenticationEnabled: authenticationEnabled};
        User.findOneAndUpdate(query, update, {new: true}).then(user => {
            response.status(200).json({authenticationEnabled: user.authenticationEnabled}).end();
        }).catch(error => console.log(error));
    });
}