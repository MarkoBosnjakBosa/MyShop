module.exports = function(app, models, validation) {
    const User = models.User;
    app.get("/getUser/:username", (request, response) => {
        var username = request.params.username;
        var query = {"account.username": username};
        User.findOne(query).then(user => {
            user.account.password = null;
            user.account.isAdmin = null;
            response.status(200).json({account: user.account, address: user.address}).end();
        }).catch(error => console.log(error));
    });
    app.put("/editAccount", validation.validateAccountEdit, (request, response) => {
        var account = request.body.account;
        var username = account.username;
        var email = account.email;
        var firstName = account.firstName;
        var lastName = account.lastName;
        var mobileNumber = account.mobileNumber;
        var query = {"account.username": username};
        var update = {"account.email": email, "account.firstName": firstName, "account.lastName": lastName, "account.mobileNumber": mobileNumber};
        var options = {new: true};
        User.findOneAndUpdate(query, update, options).then(user => {
            response.status(200).json({edited: true}).end();
        }).catch(error => console.log(error));
    });
    app.put("/editAddress", validation.validateAddressEdit, (request, response) => {
        var username = request.body.username;
        var address = request.body.address;
        var street = address.street;
        var houseNumber = address.houseNumber;
        var city = address.city;
        var zipCode = address.zipCode;
        var country = address.country;
        var query = {"account.username": username};
        var update = {address: {street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country}};
        var options = {new: true};
        User.findOneAndUpdate(query, update, options).then(user => {
            response.status(200).json({edited: true}).end();
        }).catch(error => console.log(error));
    });
}