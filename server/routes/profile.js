module.exports = function(app, models, validation) {
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
    app.put("/editAccount", validation.validateAccountEdit, (request, response) => {
        var username = request.body.username;
        var email = request.body.email;
        var firstName = request.body.firstName;
        var lastName = request.body.lastName;
        var mobileNumber = request.body.mobileNumber;
        var query = {username: username};
        var update = {email: email, firstName: firstName, lastName: lastName, mobileNumber: mobileNumber};
        User.findOneAndUpdate(query, update).then(user => {
            response.status(200).json({edited: true}).end();
        }).catch(error => console.log(error));
    });
    app.put("/editAddress", validation.validateAddressEdit, (request, response) => {
        var username = request.body.username;
        var street = request.body.street;
        var houseNumber = request.body.houseNumber;
        var city = request.body.city;
        var zipCode = request.body.zipCode;
        var country = request.body.country;
        var query = {username: username};
        var update = {street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country};
        User.findOneAndUpdate(query, update).then(user => {
            response.status(200).json({edited: true}).end();
        }).catch(error => console.log(error));
    });
}