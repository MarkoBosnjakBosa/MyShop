module.exports = function(app, bcryptjs, models, emailEvent, validation) {
    const User = models.User;
    app.post("/forgotCredentials", validation.validateForgotCredentials, (request, response) => {
		var email = request.body.email;
		var option = request.body.option;
		var query = {"account.email": email}; 
		User.findOne(query).then(user => {
			if(!validation.isEmpty(user)) {
				if(option == "password") {
					var acceptanceToken = Math.floor(100000 + Math.random() * 900000);
					var update = {acceptanceToken: acceptanceToken};
					User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
						emailEvent.emit("sendResetPasswordEmail", updatedUser.email, updatedUser.firstName, updatedUser.username, updatedUser.acceptanceToken);
					}).catch(error => console.log(error));
				} else if(option == "username") {
					emailEvent.emit("sendForgotUsernameEmail", user.account);
				} else {
					var acceptanceToken = Math.floor(100000 + Math.random() * 900000);
					var update = {"acceptance.acceptanceToken": acceptanceToken};
					User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
						emailEvent.emit("sendConfirmationEmail", updatedUser.account, updatedUser.acceptance.acceptanceToken);
					}).catch(error => console.log(error));
				}
				response.status(200).json({sent: true}).end();
			} else {
				response.status(200).json({sent: false}).end();
			}
		}).catch(error => console.log(error));
	});
    app.post("/sendConfirmationEmail", (request, response) => {
        var username = request.body.username;
        var query = {"account.username": username};
        var acceptanceToken = Math.floor(100000 + Math.random() * 900000);
        var update = {"acceptance.acceptanceToken": acceptanceToken};
        User.findOneAndUpdate(query, update, {new: true}).then(user => {
            emailEvent.emit("sendConfirmationEmail", user.account, user.acceptance.acceptanceToken);
            response.status(200).json({emailSent: true}).end();
        })
    });
	app.put("/resetPassword", validation.validatePasswordResetting, (request, response) => {
		var username = request.body.username;
		var password = request.body.password;
		var isLoggedIn = request.body.isLoggedIn;
		var query;
		if(isLoggedIn) {
			query = {"account.username": username};
		} else {
			var confirmationToken = request.body.confirmationToken;
			query = {$and: [{"account.username": username}, {"confirmation.confrmationToken": confirmationToken}]};
		} 
		bcryptjs.genSalt(10, (error, salt) => {
			bcryptjs.hash(password, salt, (error, hashedPassword) => {
				var update = {"account.password": hashedPassword, "account.confirmationToken": ""};
				User.findOneAndUpdate(query, update, {new: true}).then(user => {
					if(!validation.isEmpty(user)) {
						response.status(200).json({reset: true}).end();
					} else {
						response.status(200).json({reset: false}).end();
					}
				}).catch(error => console.log(error));
			});
		});
	});
}