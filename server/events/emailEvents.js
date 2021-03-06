module.exports = function(EventEmitter, ejs, fs, path, transporter) {
	const emailEvent = new EventEmitter();
	emailEvent.on("sendResetPasswordEmail", (account, resetPasswordToken) => {
		sendResetPasswordEmail(account, resetPasswordToken); 
	});
	emailEvent.on("sendForgotUsernameEmail", (account) => {
		sendForgotUsernameEmail(account); 
	});
	emailEvent.on("sendConfirmationEmail", (account, confirmationToken) => {
		sendConfirmationEmail(account, confirmationToken); 
	});
	emailEvent.on("sendInvoiceEmail", (account, orderNumber) => {
		sendInvoiceEmail(account, orderNumber); 
	});
	emailEvent.on("sendOrderDispatchedEmail", (account, orderNumber, orderId) => {
		sendOrderDispatchedEmail(account, orderNumber, orderId); 
	});
	emailEvent.on("sendContactEmail", (contact) => {
		sendContactEmail(contact); 
	});

	function sendResetPasswordEmail(account, resetPasswordToken) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/resetPassword.html"), "UTF-8"));
		var html = compiledHtml({firstName: account.firstName, username: account.username, resetPasswordToken: resetPasswordToken, baseUrl: process.env.BASE_URL, clientPort: process.env.CLIENT_PORT});
		var mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: account.email,
			subject: "MyShop - Reset password",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendForgotUsernameEmail(account) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/forgotUsername.html"), "UTF-8"));
		var html = compiledHtml({firstName: account.firstName, username: account.username});
		var mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: account.email,
			subject: "MyShop - Retrieve username",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendConfirmationEmail(account, confirmationToken) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/confirmation.html"), "UTF-8"));
		var html = compiledHtml({firstName: account.firstName, username: account.username, confirmationToken: confirmationToken, baseUrl: process.env.BASE_URL, clientPort: process.env.CLIENT_PORT});
		var mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: account.email,
			subject: "MyShop - Confirm registration",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendInvoiceEmail(account, orderNumber) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/invoice.html"), "UTF-8"));
		var html = compiledHtml({firstName: account.firstName});
		var mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: account.email,
			subject: "MyShop - Invoice " + orderNumber,
			attachments: [{filename: "Invoice_" + orderNumber, path: path.join(__dirname, "../temporary/Invoice_" + orderNumber + ".pdf"), contentType: "application/pdf"}],
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendOrderDispatchedEmail(account, orderNumber, orderId) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/orderDispatched.html"), "UTF-8"));
		var html = compiledHtml({firstName: account.firstName, orderNumber: orderNumber, orderId: orderId, baseUrl: process.env.BASE_URL, clientPort: process.env.CLIENT_PORT});
		var mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: account.email,
			subject: "MyShop - Order #" + orderNumber + " dispatched",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendContactEmail(contact) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/contact.html"), "UTF-8"));
		var html = compiledHtml({firstName: contact.firstName});
		var mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: contact.email,
			subject: "MyShop - Contact",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	return emailEvent;
}