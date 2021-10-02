module.exports = function(app, models, bcryptjs, emailEvents, validations) {
	const User = models.User;
	app.post("/forgotCredentials", validations.validateForgotCredentials, (request, response) => {
		var email = request.body.email;
		var option = request.body.option;
		var query = {"account.email": email}; 
		User.findOne(query).then(user => {
			if(!validations.isEmpty(user)) {
				if(option == "password") {
					var resetPasswordToken = Math.floor(100000 + Math.random() * 900000);
					var update = {"confirmation.resetPasswordToken": resetPasswordToken};
					var options = {new: true};
					User.findOneAndUpdate(query, update, options).then(updatedUser => {
						emailEvents.emit("sendResetPasswordEmail", updatedUser.account, updatedUser.confirmation.resetPasswordToken);
						setTimeout(function() { deleteToken("resetPasswordToken", user.account.username); }, 5 * 60 * 1000);
					}).catch(error => console.log(error));
				} else if(option == "username") {
					emailEvents.emit("sendForgotUsernameEmail", user.account);
				} else {
					var confirmationToken = Math.floor(100000 + Math.random() * 900000);
					var update = {"confirmation.confirmationToken": confirmationToken};
					var options = {new: true};
					User.findOneAndUpdate(query, update, options).then(updatedUser => {
						emailEvents.emit("sendConfirmationEmail", updatedUser.account, updatedUser.confirmation.confirmationToken);
						setTimeout(function() { deleteToken("confirmationToken", user.account.username); }, 5 * 60 * 1000);
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
		var options = {new: true};
		User.findOneAndUpdate(query, update, options).then(user => {
			if(!validations.isEmpty(user)) {
				emailEvents.emit("sendConfirmationEmail", user.account, user.confirmation.confirmationToken);
				setTimeout(function() { deleteToken("confirmationToken", user.account.username); }, 5 * 60 * 1000);
				response.status(200).json({emailSent: true}).end();
			} else {
				response.status(200).json({emailSent: false}).end();
			}
		}).catch(error => console.log(error));
	});
	app.put("/resetPassword", validations.validatePasswordResetting, (request, response) => {
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
				var options = {new: true};
				User.findOneAndUpdate(query, update, options).then(user => {
					if(!validations.isEmpty(user)) {
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