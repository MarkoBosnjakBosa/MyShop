module.exports = function(app, bcryptjs, models, emailEvent, validation, reCaptchav2SecretKey, axios) {
    const User = models.User;
    app.post("/createUser", (request, response) => {
        var allowRegistration = true;
        var errorFields = [];
        var username = request.body.username;
        if(validation.invalidUsername(username)) {
            errorFields.push("username");
            allowRegistration = false;
        }
        var email = request.body.email;
        if(validation.invalidEmail(email)) {
            errorFields.push("email");
            allowRegistration = false;
        }
        var password = request.body.password;
        if(validation.invalidPassword(password)) {
            errorFields.push("password");
            allowRegistration = false;
        }
        var firstName = request.body.firstName;
        if(!firstName) {
            errorFields.push("firstName");
            allowRegistration = false;
        }
        var lastName = request.body.lastName;
        if(!lastName) {
            errorFields.push("lastName");
            allowRegistration = false;
        }
        var mobileNumber = request.body.mobileNumber;
        if(validation.invalidMobileNumber(mobileNumber)) {
            errorFields.push("mobileNumber");
            allowRegistration = false;
        }
        var street = request.body.street;
        if(!street) {
            errorFields.push("street");
            allowRegistration = false;
        }
        var houseNumber = request.body.houseNumber;
        if(validation.invalidHouseNumber(houseNumber)) {
            errorFields.push("houseNumber");
            allowRegistration = false;
        }
        var city = request.body.city;
        if(!city) {
            errorFields.push("city");
            allowRegistration = false;
        }
        var zipCode = request.body.zipCode;
        if(validation.invalidZipCode(zipCode)) {
            errorFields.push("zipCode");
            allowRegistration = false;
        }
        var country = request.body.country;
        if(!country) {
            errorFields.push("country");
            allowRegistration = false;
        }
        var reCaptchaToken = request.body.reCaptchaToken;
        if(validation.invalidReCaptchaToken(reCaptchav2SecretKey, axios, reCaptchaToken, request.connection.remoteAddress)) {
            errorFields.push("reCaptchaToken");
            allowRegistration = false;
        }
        if(allowRegistration) {
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
        } else {
            response.status(200).json({created: false, alreadyExists: false, errorFields: errorFields}).end();
        }
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