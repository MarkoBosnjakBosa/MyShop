module.exports = function(app, bcryptjs, models, emailEvent) {
    const User = models.User;
	app.post("/sendConfirmationEmail", (request, response) => {
        var username = request.body.username;
        var query = {username: username};
        var authenticationToken = Math.floor(100000 + Math.random() * 900000);
        var update = {authenticationToken: authenticationToken};
        User.findOneAndUpdate(query, update, {new: true}).then(user => {
            emailEvent.emit("sendConfirmationEmail", user.email, user.firstName, user.username, user.authenticationToken);
            response.status(200).json({emailSent: true}).end();
        })
    });
}