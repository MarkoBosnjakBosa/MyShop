module.exports = function(app, bcryptjs, models, emailEvent) {
    const User = models.User;
    app.post("/forgotCredentials", (request, response) => {
		var email = request.body.email;
		var option = request.body.option;
		if(validEmail(email) && option) {
			var query = {email: email}; 
			User.findOne(query).then(user => {
				if(!isEmpty(user)) {
					if(option == "password") {
						var acceptanceToken = Math.floor(100000 + Math.random() * 900000);
						var update = {acceptanceToken: acceptanceToken};
						User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
                        	emailEvent.emit("sendResetPasswordEmail", updatedUser.email, updatedUser.firstName, updatedUser.username, updatedUser.acceptanceToken);
						}).catch(error => console.log(error));
					} else if(option == "username") {
                        emailEvent.emit("sendForgotUsernameEmail", user.email, user.firstName, user.username);
					} else {
						var acceptanceToken = Math.floor(100000 + Math.random() * 900000);
						var update = {acceptanceToken: acceptanceToken};
						User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
                        	emailEvent.emit("sendConfirmationEmail", updatedUser.email, updatedUser.firstName, updatedUser.username, updatedUser.acceptanceToken);
						}).catch(error => console.log(error));
					}
					response.status(200).json({sent: true}).end();
				} else {
					response.status(200).json({sent: false}).end();
				}
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({sent: false}).end();
		}
	});
    app.post("/sendConfirmationEmail", (request, response) => {
        var username = request.body.username;
        var query = {username: username};
        var authenticationToken = Math.floor(100000 + Math.random() * 900000);
        var update = {authenticationToken: authenticationToken};
        User.findOneAndUpdate(query, update, {new: true}).then(user => {
            emailEvent.emit("sendConfirmationEmail", user.email, user.firstName, user.username, user.acceptanceToken);
            response.status(200).json({emailSent: true}).end();
        })
    });
	app.put("/resetPassword", (request, response) => {
		var username = request.body.username;
		var acceptanceToken = request.body.acceptanceToken;
		var password = request.body.password;
		if(username && validPassword(password)) {
			var query = {$and: [{username: username}, {acceptanceToken: acceptanceToken}]}; 
			bcryptjs.genSalt(10, (error, salt) => {
				bcryptjs.hash(password, salt, (error, hashedPassword) => {
					var update = {password: hashedPassword, acceptanceToken: ""};
					User.findOneAndUpdate(query, update, {new: true}).then(user => {
						if(!isEmpty(user)) {
							response.status(200).json({reset: true}).end();
						} else {
							response.status(200).json({reset: false}).end();
						}
					}).catch(error => console.log(error));
				});
			});
		} else {
			response.status(200).json({reset: false});
			response.end();
		}
	});

    function validEmail(email) {
		var emailFormat = /\S+@\S+\.\S+/;
		if(email != "" && emailFormat.test(email)) {
			return true;
		} else {
			return false;
		}
	}
	function validPassword(password) {
		var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if(password != "" && passwordFormat.test(password)) {
			return true;
		} else {
			return false;
		}
	}
    function isEmpty(object) {
		return !object || Object.keys(object).length === 0;
	}
}