module.exports = function(app, models, bcryptjs, emailEvent, validation) {
    const User = models.User;
    app.post("/registerUser", validation.validateRegistration, (request, response) => {
        var user = request.body.user;
        var account = user.account;
        var address = user.address;
        var query = {$or: [{"account.username": account.username}, {"account.email": account.email}, {"account.mobileNumber": account.mobileNumber}]};
        User.findOne(query).then(user => {
            if(!validation.isEmpty(user)) {
                var error = {registered: false, alreadyExists: true};
                if(user.account.username == account.username) {
                    error.field = "username";
                } else {
                    error.field = "email";
                }
                response.status(200).json(error).end();
            } else {
                var confirmation = {confirmed: false, confirmationToken: Math.floor(100000 + Math.random() * 900000), authenticationEnabled: true, authenticationToken: "", authenticationEnablingToken: ""};
                account.isAdmin = false;
                var newUser = getUserScheme(User, account, address, confirmation);
                bcryptjs.genSalt(10, (error, salt) => {
                    bcryptjs.hash(newUser.account.password, salt, (error, hashedPassword) => {
                        newUser.account.password = hashedPassword;
                        newUser.save().then(createdUser => {
                            emailEvent.emit("sendConfirmationEmail", createdUser.account, createdUser.confirmation.confirmationToken);
                            setTimeout(function() {
                                deleteConfirmationToken(createdUser.account.username);    
                            }, 5 * 60 * 1000);
                            response.status(200).json({registered: true}).end();
                        }).catch(error => console.log(error));
                    });
                });
            }
        }).catch(error => console.log(error));
    });
    app.get("/confirm/registration", (request, response) => {
		var username = request.query.username;
		var confirmationToken = request.query.confirmationToken;
		var query = {$and: [{"account.username": username}, {"confirmation.confirmationToken": confirmationToken}]}; 
		var update = {"confirmation.confirmed": true, "confirmation.confirmationToken": ""};
		User.findOneAndUpdate(query, update, {new: true}).then(user => {
			if(!validation.isEmpty(user)) {
				response.status(200).json({confirmed: true}).end();
			} else {
				response.status(200).json({confirmed: false}).end();
			}
		}).catch(error => console.log(error));
	});

    function deleteConfirmationToken(username) {
        var query = {"account.username": username};
        var update = {"confirmation.confirmationToken": ""};
        User.findOneAndUpdate(query, update, {new: true}).then().catch(error => console.log(error));
    }
    function getUserScheme(User, account, address, confirmation) {
		return new User({account: account, address: address, confirmation: confirmation});
	}
}