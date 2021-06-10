module.exports = function(EventEmitter, ejs, fs, path, transporter) {
    const emailEvent = new EventEmitter();
    emailEvent.on("sendResetPasswordEmail", (account, confirmationToken) => {
        sendResetPasswordEmail(account, confirmationToken); 
    });
	emailEvent.on("sendForgotUsernameEmail", (account) => {
        sendForgotUsernameEmail(account); 
    });
	emailEvent.on("sendConfirmationEmail", (account, confirmationToken) => {
        sendConfirmationEmail(account, confirmationToken); 
    });
	emailEvent.on("sendInvoiceEmail", (account, confirmationToken) => {
        sendInvoiceEmail(account, confirmationToken); 
    });
	emailEvent.on("sendContactEmail", (contact) => {
        sendContactEmail(contact); 
    });

	function sendResetPasswordEmail(account, confirmationToken) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/resetPassword.html"), "utf-8"));
		var html = compiledHtml({firstName: account.firstName, username: account.username, confirmationToken: confirmationToken, baseUrl: process.env.BASE_URL, clientPort: process.env.CLIENT_PORT});
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: account.email,
			subject: "Reset password",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendForgotUsernameEmail(account) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/forgotUsername.html"), "utf-8"));
		var html = compiledHtml({firstName: account.firstName, username: account.username});
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: account.email,
			subject: "Retrieve username",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
    function sendConfirmationEmail(account, confirmationToken) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/confirmation.html"), "utf-8"));
		var html = compiledHtml({firstName: account.firstName, username: account.username, confirmationToken: confirmationToken, baseUrl: process.env.BASE_URL, clientPort: process.env.CLIENT_PORT});
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: account.email,
			subject: "Confirm registration",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendInvoiceEmail(account, invoiceNumber) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/invoice.html"), "utf-8"));
		var html = compiledHtml({firstName: account.firstName});
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: account.email,
			subject: "Invoice " + invoiceNumber,
			attachments: [{filename: "invoice_" + invoiceNumber, path: path.join(__dirname, "../invoices/invoice_" + invoiceNumber + ".pdf"), contentType: "application/pdf"}],
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendContactEmail(contact) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/contact.html"), "utf-8"));
		console.log(contact);
		var html = compiledHtml({firstName: contact.firstName, lastName: contact.lastName});
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: contact.email,
			subject: "Contact",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
    return emailEvent;
}