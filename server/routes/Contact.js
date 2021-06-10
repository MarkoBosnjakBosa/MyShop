module.exports = function(app, models, emailEvent, validation) {
    const Contact = models.Contact;
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

    function getContactScheme(Contact, firstName, lastName, email, message) {
		return new Contact({firstName: firstName, lastName: lastName, email: email, message: message});
	}
}