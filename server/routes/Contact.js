module.exports = function(app, models, emailEvent, validation) {
    const ContactSettings = models.ContactSettings;
    const Contact = models.Contact;
    app.get("/getContactSettings", (request, response) => {
        var query = {};
        ContactSettings.find(query).then(contactSettings => {
            if(!validation.isEmpty(contactSettings)) {
                response.status(200).json({contactSettings: contactSettings}).end();
            } else {
                response.status(200).json({contactSettings: {id: "", latitude: 0, longitude: 0, street: "", houseNumber: 0, city: "", zipCode: 0, country: ""}}).end();
            }
        }).catch(error => console.log(error));
    });
    app.post("/saveContactSettings", validation.validateContactSettings, (request, response) => {
        var contactSettings = request.body.contactSettings;
        var id = contactSettings.id;
        var latitude = contactSettings.latitude;
        var longitude = contactSettings.longitude;
        var street = contactSettings.street;
        var houseNumber = contactSettings.houseNumber;
        var city = contactSettings.city;
        var zipCode = contactSettings.zipCode;
        var country = contactSettings.country;
        if(id) {
            var query = {_id: id};
            var update = {latitude: latitude, longitude: longitude, street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country};
            var options = {upsert: true, new: true, setDefaultsOnInsert: true};
            ContactSettings.findOneAndUpdate(query, update, options).then(savedContactSettings => {
                response.status(200).json({saved: true}).end();
            }).catch(error => console.log(error));
        } else {
            var newContactSettings = getContactSettingsScheme(ContactSettings, latitude, longitude, street, houseNumber, city, zipCode, country);
            newContactSettings.save().then(savedContactSettings => {
                response.status(200).json({saved: true, id: savedContactSettings._id}).end();
            }).catch(error => console.log(error));
        }
    });
    app.post("/contact", validation.validateContact, (request, response) => {
        var contact = request.body.contact;
        var firstName = contact.firstName;
        var lastName = contact.lastName;
        var email = contact.email;
        var message = contact.message;
        var newContact = getContactScheme(Contact, firstName, lastName, email, message);
        newContact.save().then(contact => {
            emailEvent.emit("sendContactEmail", contact);
            response.status(200).json({submitted: true}).end();
        }).catch(error => console.log(error));
    });

    function getContactSettingsScheme(ContactSettings, latitude, longitude, street, houseNumber, city, zipCode, country) {
		return new ContactSettings({latitude: latitude, longitude: longitude, street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country});
	}
    function getContactScheme(Contact, firstName, lastName, email, message) {
		return new Contact({firstName: firstName, lastName: lastName, email: email, message: message});
	}
}