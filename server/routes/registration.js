module.exports = function(app, reCaptchav2SecretKey, axios, bcryptjs, models, emailEvent) {
    const User = models.User;
    app.post("/createUser", (request, response) => {
        var allowRegistration = true;
        var errorFields = [];
        var username = request.body.username;
        if(invalidUsername(username)) {
            errorFields.push("username");
            allowRegistration = false;
        }
        var email = request.body.email;
        if(invalidEmail(email)) {
            errorFields.push("email");
            allowRegistration = false;
        }
        var password = request.body.password;
        if(invalidPassword(password)) {
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
        if(invalidMobileNumber(mobileNumber)) {
            errorFields.push("mobileNumber");
            allowRegistration = false;
        }
        var address = request.body.address;
        if(!address) {
            errorFields.push("address");
            allowRegistration = false;
        }
        var houseNumber = request.body.houseNumber;
        if(invalidHouseNumber(houseNumber)) {
            errorFields.push("houseNumber");
            allowRegistration = false;
        }
        var city = request.body.city;
        if(!city) {
            errorFields.push("city");
            allowRegistration = false;
        }
        var zipCode = request.body.zipCode;
        if(invalidZipCode(zipCode)) {
            errorFields.push("zipCode");
            allowRegistration = false;
        }
        var country = request.body.country;
        if(!country) {
            errorFields.push("country");
            allowRegistration = false;
        }
        var reCaptchaToken = request.body.reCaptchaToken;
        if(invalidReCaptchaToken(reCaptchaToken, request.connection.remoteAddress)) {
            errorFields.push("reCaptchaToken");
            allowRegistration = false;
        }
        if(allowRegistration) {
            var query = {$or: [{username: username}, {email: email}, {mobileNumber: mobileNumber}]};
            User.findOne(query).then(user => {
                if(!isEmpty(user)) {
                    var error = {created: false, alreadyExists: true};
                    if(user.username == username) {
                        error.field = "username";
                    } else {
                        error.field = "email";
                    }
                    response.status(200).json(error);
                    response.end();
                } else {
                    var accepted = false;
                    var acceptanceToken = Math.floor(100000 + Math.random() * 900000);
                    var authenticationEnabled = true;
                    var authenticationToken = "";
                    var isAdmin = false;
                    var newUser = getUserScheme(User, username, email, password, firstName, lastName, mobileNumber, address, houseNumber, city, zipCode, country, accepted, acceptanceToken, authenticationEnabled, authenticationToken, isAdmin);
                    bcryptjs.genSalt(10, (error, salt) => {
                        bcryptjs.hash(newUser.password, salt, (error, hashedPassword) => {
                            newUser.password = hashedPassword;
                            newUser.save().then(user => {
                                notifier.emit("sendConfirmationEmail", user.email, user.firstName, user.username, user.acceptanceToken);
                                response.status(200).json({created: true});
                                response.end();
                            }).catch(error => console.log(error));
                        });
                    });
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({created: false, alreadyExists: false, errorFields: errorFields});
            response.end();
        }
    });

    function getUserScheme(User, username, email, password, firstName, lastName, mobileNumber, address, houseNumber, city, zipCode, country, accepted, acceptanceToken, authenticationEnabled, authenticationToken, isAdmin) {
		return new User({username: username, email: email, password: password, firstName: firstName, lastName: lastName, mobileNumber: mobileNumber, address: address, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country, accepted: accepted, acceptanceToken: acceptanceToken, authenticationEnabled: authenticationEnabled, authenticationToken: authenticationToken, isAdmin: isAdmin});
	}
    function invalidUsername(username) {
		var usernameFormat = /^[a-z0-9_.-]*$/;
		if(username != "" && usernameFormat.test(username)) {
			return false;
		} else {
			return true;
		}
	}
	function invalidEmail(email) {
		var emailFormat = /\S+@\S+\.\S+/;
		if(email != "" && emailFormat.test(email)) {
			return false;
		} else {
			return true;
		}
	}
	function invalidPassword(password) {
		var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if(password != "" && passwordFormat.test(password)) {
			return false;
		} else {
			return true;
		}
	}
    function invalidMobileNumber(mobileNumber) {
        var mobileNumberFormat = /^[0-9]\d*$/;
        if(mobileNumber != "" && mobileNumberFormat.test(mobileNumber)) {
            return false;
        } else {
            return true;
        }
    }
    function invalidHouseNumber(houseNumber) {
        var houseNumberFormat = /^[0-9]\d*$/;
        if(houseNumber != "" && houseNumberFormat.test(houseNumber)) {
            return false;
        } else {
            return true;
        }
    }
    function invalidZipCode(zipCode) {
        var zipCodeFormat = /^[0-9]\d*$/;
        if(zipCode != "" && zipCodeFormat.test(zipCode)) {
            return false;
        } else {
            return true;
        }
    }
    function invalidReCaptchaToken(reCaptchaToken, remoteIp) {
        if(reCaptchaToken == "" || reCaptchaToken == undefined || reCaptchaToken == null) {
            return true;
        } else {
            var reCaptchaVerificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + reCaptchav2SecretKey + "&response=" + reCaptchaToken + "&remoteip=" + remoteIp;
            axios.get(reCaptchaVerificationUrl).then(reCaptchaResponse => {
                if(reCaptchaResponse.data.success) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    }
	function isEmpty(object) {
		return !object || Object.keys(object).length === 0;
	}
}