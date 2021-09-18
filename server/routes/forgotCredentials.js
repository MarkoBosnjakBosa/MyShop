module.exports = function(app, models, bcryptjs, emailEvent, validation) {
    const User = models.User;
    app.post("/forgotCredentials", validation.validateForgotCredentials, (request, response) => {
		var email = request.body.email;
		var option = request.body.option;
		var query = {"account.email": email}; 
		User.findOne(query).then(user => {
			if(!validation.isEmpty(user)) {
				if(option == "password") {
					var resetPasswordToken = Math.floor(100000 + Math.random() * 900000);
					var update = {"confirmation.resetPasswordToken": resetPasswordToken};
					User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
						emailEvent.emit("sendResetPasswordEmail", updatedUser.account, updatedUser.confirmation.resetPasswordToken);
						setTimeout(function() {
							deleteToken("resetPasswordToken", user.account.username);    
						}, 5 * 60 * 1000);
					}).catch(error => console.log(error));
				} else if(option == "username") {
					emailEvent.emit("sendForgotUsernameEmail", user.account);
				} else {
					var confirmationToken = Math.floor(100000 + Math.random() * 900000);
					var update = {"confirmation.confirmationToken": confirmationToken};
					User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
						emailEvent.emit("sendConfirmationEmail", updatedUser.account, updatedUser.confirmation.confirmationToken);
						setTimeout(function() {
							deleteToken("confirmationToken", user.account.username);    
						}, 5 * 60 * 1000);
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
        var confirmationToken = Math.floor(100000 + Math.random() * 900000);
        var update = {"confirmation.confirmationToken": confirmationToken};
        User.findOneAndUpdate(query, update, {new: true}).then(user => {
            emailEvent.emit("sendConfirmationEmail", user.account, user.confirmation.confirmationToken);
			setTimeout(function() {
				deleteToken("confirmationToken", user.account.username);    
			}, 5 * 60 * 1000);
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
			var resetPasswordToken = request.body.resetPasswordToken;
			query = {$and: [{"account.username": username}, {"confirmation.resetPasswordToken": resetPasswordToken}]};
		} 
		bcryptjs.genSalt(10, (error, salt) => {
			bcryptjs.hash(password, salt, (error, hashedPassword) => {
				var update = {"account.password": hashedPassword, "confirmation.resetPasswordToken": ""};
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

	function deleteToken(type, username) {
		var query = {"account.username": username};
		var update;
		if(type == "resetPasswordToken") {
			update = {"confirmation.resetPasswordToken": ""};
		} else {
			update = {"confirmation.confirmationToken": ""};
		}
        User.findOneAndUpdate(query, update, {new: true}).then().catch(error => console.log(error));
    }
}