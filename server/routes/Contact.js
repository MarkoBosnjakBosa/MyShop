module.exports = function(app, models, emailEvent, moment, validation) {
    const ContactSettings = models.ContactSettings;
    const Contact = models.Contact;
    app.get("/getContactSettings", (request, response) => {
        var query = {};
        ContactSettings.find(query).then(contactSettings => {
            if(!validation.isEmpty(contactSettings) && contactSettings.length > 0) {
                response.status(200).json({contactSettings: contactSettings[0]}).end();
            } else {
                response.status(200).json({contactSettings: {_id: "", coordinates: {lat: "", lng: ""}, street: "", houseNumber: "", city: "", zipCode: "", country: ""}}).end();
            }
        }).catch(error => console.log(error));
    });
    app.post("/saveContactSettings", validation.validateContactSettings, (request, response) => {
        var contactSettings = request.body.contactSettings;
        var id = contactSettings._id;
        var coordinates = contactSettings.coordinates;
        var street = contactSettings.street;
        var houseNumber = contactSettings.houseNumber;
        var city = contactSettings.city;
        var zipCode = contactSettings.zipCode;
        var country = contactSettings.country;
        if(id) {
            var query = {_id: id};
            var update = {coordinates: coordinates, street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country};
            ContactSettings.findOneAndUpdate(query, update).then(savedContactSettings => {
                response.status(200).json({saved: true, id: savedContactSettings._id}).end();
            }).catch(error => console.log(error));
        } else {
            var newContactSettings = getContactSettingsScheme(ContactSettings, coordinates, street, houseNumber, city, zipCode, country);
            newContactSettings.save().then(savedContactSettings => {
                response.status(200).json({saved: true, id: savedContactSettings._id}).end();
            }).catch(error => console.log(error));
        }
    });
    app.get("/getContacts", (request, response) => {
        var query = {};
        Contact.find(query).then(contacts => {
            response.status(200).json({contacts: contacts}).end();
        }).catch(error => console.log(error));
    });
    app.post("/contact", validation.validateContact, (request, response) => {
        var contact = request.body.contact;
        var firstName = contact.firstName;
        var lastName = contact.lastName;
        var email = contact.email;
        var message = contact.message;
        var dateFormat = "DD.MM.YYYY HH:mm";
	    var date = moment().format(dateFormat);
        var newContact = getContactScheme(Contact, firstName, lastName, email, message, date);
        newContact.save().then(contact => {
            emailEvent.emit("sendContactEmail", contact);
            response.status(200).json({submitted: true}).end();
        }).catch(error => console.log(error));
    });

    function getContactSettingsScheme(ContactSettings, coordinates, street, houseNumber, city, zipCode, country) {
		return new ContactSettings({coordinates: coordinates, street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country});
	}
    function getContactScheme(Contact, firstName, lastName, email, message, date) {
		return new Contact({firstName: firstName, lastName: lastName, email: email, message: message, date: date});
	}
}