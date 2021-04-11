module.exports = function(app, models) {
    const User = models.User;
    app.get("/getUser/:username", (request, response) => {
        var username = request.params.username;
        var query = {username: username};
        User.findOne(query).then(user => {
            var account = {username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, mobileNumber: user.mobileNumber};
            var address = {street: user.street, houseNumber: user.houseNumber, city: user.city, zipCode: user.zipCode, country: user.country};
            response.status(200).json({account: account, address: address}).end();
        }).catch(error => console.log(error));
    });
    app.put("/editAccount", (request, response) => {
        var allowEdit = true;
        var errorFields = [];
        var username = request.body.username;
        var email = request.body.email;
        if(!username && invalidEmail(email)) {
            errorFields.push("email");
            allowEdit = false;
        }
        var firstName = request.body.firstName;
        if(!firstName) {
            errorFields.push("firstName");
            allowEdit = false;
        }
        var lastName = request.body.lastName;
        if(!lastName) {
            errorFields.push("lastName");
            allowEdit = false;
        }
        var mobileNumber = request.body.mobileNumber;
        if(invalidMobileNumber(mobileNumber)) {
            errorFields.push("mobileNumber");
            allowEdit = false;
        }
        if(allowEdit) {
            var query = {username: username};
            var update = {email: email, firstName: firstName, lastName: lastName, mobileNumber: mobileNumber};
            User.findOneAndUpdate(query, update).then(user => {
                response.status(200).json({edited: true}).end();
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({edited: false, errorFields: errorFields}).end();
        }
    });
    app.put("/editAddress", (request, response) => {
        var allowEdit = true;
        var errorFields = [];
        var username = request.body.username;
        var street = request.body.street;
        if(!username && !street) {
            errorFields.push("street");
            allowEdit = false;
        }
        var houseNumber = request.body.houseNumber;
        if(invalidHouseNumber(houseNumber)) {
            errorFields.push("houseNumber");
            allowEdit = false;
        }
        var city = request.body.city;
        if(!city) {
            errorFields.push("city");
            allowEdit = false;
        }
        var zipCode = request.body.zipCode;
        if(invalidZipCode(zipCode)) {
            errorFields.push("zipCode");
            allowEdit = false;
        }
        var country = request.body.country;
        if(!country) {
            errorFields.push("country");
            allowEdit = false;
        }
        if(allowEdit) {
            var query = {username: username};
            var update = {street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country};
            User.findOneAndUpdate(query, update).then(user => {
                response.status(200).json({edited: true}).end();
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({edited: false, errorFields: errorFields}).end();
        }
    });

    function invalidEmail(email) {
		var emailFormat = /\S+@\S+\.\S+/;
		if(email != "" && emailFormat.test(email)) {
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
}