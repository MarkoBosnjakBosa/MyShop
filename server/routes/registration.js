module.exports = function(app, bcryptjs, models, emailEvent, validation) {
    const User = models.User;
    app.post("/createUser", validation.validateRegistration, (request, response) => {
        var username = request.body.username;
        var email = request.body.email;
        var password = request.body.password;
        var firstName = request.body.firstName;
        var lastName = request.body.lastName;
        var mobileNumber = request.body.mobileNumber;
        var street = request.body.street;
        var houseNumber = request.body.houseNumber;
        var city = request.body.city;
        var zipCode = request.body.zipCode;
        var country = request.body.country;
        var query = {$or: [{username: username}, {email: email}, {mobileNumber: mobileNumber}]};
        User.findOne(query).then(user => {
            if(!validation.isEmpty(user)) {
                var error = {created: false, alreadyExists: true};
                if(user.username == username) {
                    error.field = "username";
                } else {
                    error.field = "email";
                }
                response.status(200).json(error).end();
            } else {
                var accepted = false;
                var acceptanceToken = Math.floor(100000 + Math.random() * 900000);
                var authenticationEnabled = true;
                var authenticationToken = "";
                var authenticationEnablingToken = "";
                var isAdmin = false;
                var newUser = getUserScheme(User, username, email, password, firstName, lastName, mobileNumber, street, houseNumber, city, zipCode, country, accepted, acceptanceToken, authenticationEnabled, authenticationToken, authenticationEnablingToken, isAdmin);
                bcryptjs.genSalt(10, (error, salt) => {
                    bcryptjs.hash(newUser.password, salt, (error, hashedPassword) => {
                        newUser.password = hashedPassword;
                        newUser.save().then(user => {
                            emailEvent.emit("sendConfirmationEmail", user.email, user.firstName, user.username, user.acceptanceToken);
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
		var query = {$and: [{username: username}, {acceptanceToken: acceptanceToken}]}; 
		var update = {accepted: true, acceptanceToken: ""};
		User.findOneAndUpdate(query, update, {new: true}).then(user => {
			if(!validation.isEmpty(user)) {
				response.status(200).json({confirmed: true}).end();
			} else {
				response.status(200).json({confirmed: false}).end();
			}
		}).catch(error => console.log(error));
	});

    function getUserScheme(User, username, email, password, firstName, lastName, mobileNumber, street, houseNumber, city, zipCode, country, accepted, acceptanceToken, authenticationEnabled, authenticationToken, authenticationEnablingToken, isAdmin) {
		return new User({username: username, email: email, password: password, firstName: firstName, lastName: lastName, mobileNumber: mobileNumber, street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country, accepted: accepted, acceptanceToken: acceptanceToken, authenticationEnabled: authenticationEnabled, authenticationToken: authenticationToken, authenticationEnablingToken: authenticationEnablingToken, isAdmin: isAdmin});
	}
}