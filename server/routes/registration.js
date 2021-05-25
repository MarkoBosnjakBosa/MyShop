module.exports = function(app, bcryptjs, models, emailEvent, validation) {
    const User = models.User;
    app.post("/createUser", validation.validateRegistration, (request, response) => {
        var account = request.body.account;
        var address = request.body.address;
        var query = {$or: [{username: account.username}, {email: account.email}, {mobileNumber: account.mobileNumber}]};
        User.findOne(query).then(user => {
            if(!validation.isEmpty(user)) {
                var error = {created: false, alreadyExists: true};
                if(user.account.username == username) {
                    error.field = "username";
                } else {
                    error.field = "email";
                }
                response.status(200).json(error).end();
            } else {
                var acceptance = {accepted: false, acceptanceToken: Math.floor(100000 + Math.random() * 900000), authenticationEnabled: true, authenticationToken: "", authenticationEnablingToken: ""};
                var isAdmin = false;
                var newUser = getUserScheme(User, account, address, acceptance, isAdmin);
                bcryptjs.genSalt(10, (error, salt) => {
                    bcryptjs.hash(newUser.password, salt, (error, hashedPassword) => {
                        newUser.password = hashedPassword;
                        newUser.save().then(user => {
                            emailEvent.emit("sendConfirmationEmail", user.account.email, user.account.firstName, user.account.username, user.acceptance.acceptanceToken);
                            response.status(200).json({created: true}).end();
                        }).catch(error => console.log(error));
                    });
                });
            }
        }).catch(error => console.log(error));
    });
    app.get("/confirm/registration", (request, response) => {
		var username = request.query.username;
		var acceptanceToken = request.query.acceptanceToken;
		var query = {$and: [{"account.username": username}, {"acceptance.acceptanceToken": acceptanceToken}]}; 
		var update = {"acceptance.accepted": true, "acceptance.acceptanceToken": ""};
		User.findOneAndUpdate(query, update, {new: true}).then(user => {
			if(!validation.isEmpty(user)) {
				response.status(200).json({confirmed: true}).end();
			} else {
				response.status(200).json({confirmed: false}).end();
			}
		}).catch(error => console.log(error));
	});

    function getUserScheme(User, account, address, acceptance, isAdmin) {
		return new User({account: account, address: address, acceptance: acceptance, isAdmin: isAdmin});
	}
}