module.exports = function(app, models, moment, emailEvents, validations) {
    const ContactSettings = models.ContactSettings;
    const Contact = models.Contact;
    app.get("/getContactSettings", (request, response) => {
        var query = {};
        ContactSettings.find(query).then(contactSettings => {
            if(!validations.isEmpty(contactSettings) && contactSettings.length > 0) {
                response.status(200).json({contactSettings: contactSettings[0]}).end();
            } else {
                response.status(200).json({contactSettings: {_id: "", coordinates: {lat: 0, lng: 0}, street: "", houseNumber: 0, city: "", zipCode: 0, country: "", mobileNumber: "", email: ""}}).end();
            }
        }).catch(error => console.log(error));
    });
    app.post("/saveContactSettings", validations.validateContactSettings, (request, response) => {
        var contactSettings = request.body.contactSettings;
        var contactSettingsId = contactSettings._id;
        var coordinates = contactSettings.coordinates;
        var street = contactSettings.street;
        var houseNumber = contactSettings.houseNumber;
        var city = contactSettings.city;
        var zipCode = contactSettings.zipCode;
        var country = contactSettings.country;
        var mobileNumber = contactSettings.mobileNumber;
        var email = contactSettings.email;
        if(contactSettingsId) {
            var query = {_id: contactSettingsId};
            var update = {coordinates: coordinates, street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country, mobileNumber: mobileNumber, email: email};
            var options = {new: true};
            ContactSettings.findOneAndUpdate(query, update, options).then(savedContactSettings => {
                response.status(200).json({saved: true, contactSettingsId: savedContactSettings._id}).end();
            }).catch(error => console.log(error));
        } else {
            var newContactSettings = getContactSettingsScheme(ContactSettings, coordinates, street, houseNumber, city, zipCode, country, mobileNumber, email);
            newContactSettings.save().then(savedContactSettings => {
                response.status(200).json({saved: true, contactSettingsId: savedContactSettings._id}).end();
            }).catch(error => console.log(error));
        }
    });
    app.post("/getContacts", (request, response) => {
        var search = request.body.search;
        var page = Number(request.body.page) - 1;
        var limit = (Number.isInteger(request.body.limit) && Number(request.body.limit) > 0) ? Number(request.body.limit) : 1;
        var skip = page * limit;
        var orderBy = request.body.orderBy;
        var sort = {};
        switch(orderBy) {
            case "dateAsc":
                sort = {"date": 1};
                break;
            case "dateDesc":
                sort = {"date": -1};
                break;
            default:
                sort = {};
        }
        var query = search ? {$or: [{firstName: {$regex: search, $options: "i" }}, {lastName: {$regex: search, $options: "i"}}, {email: {$regex: search, $options: "i"}}, {message: {$regex: search, $options: "i"}}]} : {};
        var contactsQuery = Contact.find(query).sort(sort).skip(skip).limit(limit);
        var totalQuery = Contact.find(query).countDocuments();
        var queries = [contactsQuery, totalQuery];
        Promise.all(queries).then(results => {
            var total = results[1];
            var pagesNumber = 1;
            if(total >= limit) pagesNumber = Math.ceil(total / limit);
            response.status(200).json({contacts: results[0], total: total, pagesNumber: pagesNumber}).end();
        });
    });
    app.post("/newContact", validations.validateContact, (request, response) => {
        var contact = request.body.contact;
        var firstName = contact.firstName;
        var lastName = contact.lastName;
        var email = contact.email;
        var mobileNumber = contact.mobileNumber;
        var message = contact.message;
        var dateFormat = "DD.MM.YYYY HH:mm";
        var date = moment().format(dateFormat);
        var newContact = getContactScheme(Contact, firstName, lastName, email, mobileNumber, message, date);
        newContact.save().then(contact => {
            emailEvents.emit("sendContactEmail", contact);
            response.status(200).json({submitted: true}).end();
        }).catch(error => console.log(error));
    });
    app.delete("/deleteContact/:contactId", (request, response) => {
        var contactId = request.params.contactId;
        if(contactId) {
            var query = {_id: contactId};
            Contact.findOneAndRemove(query).then(contact => {
                if(!validations.isEmpty(contact)) {
                    response.status(200).json({deleted: true}).end();
                } else {
                    response.status(200).json({deleted: false}).end(); 
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({deleted: false}).end();
        }
    });

    function getContactSettingsScheme(ContactSettings, coordinates, street, houseNumber, city, zipCode, country, mobileNumber, email) {
        return new ContactSettings({coordinates: coordinates, street: street, houseNumber: houseNumber, city: city, zipCode: zipCode, country: country, mobileNumber: mobileNumber, email: email});
    }
    function getContactScheme(Contact, firstName, lastName, email, mobileNumber, message, date) {
        return new Contact({firstName: firstName, lastName: lastName, email: email, mobileNumber: mobileNumber, message: message, date: date});
    }
}