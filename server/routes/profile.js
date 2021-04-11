module.exports = function(app, models) {
    const User = models.User;
    app.get("/getUser/:username", (request, response) => {
        var username = request.params.username;
        var query = {username: username};
        User.findOne(query).then(user => {
            var account = {username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, mobileNumber: user.mobileNumber};
            var address = {address: user.address, houseNumber: user.houseNumber, city: user.city, zipCode: user.zipCode, country: user.country};
            response.status(200).json({account: account, address: address}).end();
        }).catch(error => console.log(error));
    });
}