module.exports = function(EventEmitter, ejs, fs, path, transporter) {
    const emailEvent = new EventEmitter();
    emailEvent.on("sendResetPasswordEmail", (email, firstName, username, acceptanceToken) => {
        sendResetPasswordEmail(email, firstName, username, acceptanceToken); 
    });
	emailEvent.on("sendForgotUsernameEmail", (email, firstName, username) => {
        sendForgotUsernameEmail(email, firstName, username); 
    });
	emailEvent.on("sendConfirmationEmail", (account, acceptanceToken) => {
        sendConfirmationEmail(account, acceptanceToken); 
    });
	emailEvent.on("sendInvoiceEmail", (email, firstName, username, acceptanceToken) => {
        sendInvoiceEmail(email, firstName, username, acceptanceToken); 
    });

	function sendResetPasswordEmail(email, firstName, username, acceptanceToken) {
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Reset password",
			html: "<html>" +
				"<body>" +
				"<p>Dear <b>" + firstName + "</b>,</p>" +
				"<p>thank you for using MyShop. You have requested to change your password. Click on the button below to proceed with your request:" +
				"<p style='margin-bottom: 30px;'><a href='" + process.env.BASE_URL + process.env.CLIENT_PORT +  "/reset/password?username=" + username + "&acceptanceToken=" + acceptanceToken + "' target='_blank' style=' background-color: #1a1aff; border: none; color: #fff; padding: 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; border-radius:5px;'>Reset password</a></p>" +
				"<p>Kind regards,<br/> your Admin Team</p>" +
				"</body>" +
				"</html>"
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendForgotUsernameEmail(email, firstName, username) {
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Retrieve username",
			html: "<html>" +
				"<body>" +
				"<p>Dear <b>" + firstName + "</b>,</p>" +
				"<p>thank you for using MyShop. You have requested to retrieve your username. Your username is: <b><i>" + username + "</i></b>.</p>" +
				"<p>Kind regards,<br/> your Admin Team</p>" +
				"</body>" +
				"</html>"
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
    function sendConfirmationEmail(account, acceptanceToken) {
		var compiledHtml = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/email/confirmation.html"), "utf-8"));
		var html = compiledHtml({firstName: account.firstName, username: account.username, acceptanceToken: acceptanceToken, baseUrl: process.env.BASE_URL, clientPort: process.env.CLIENT_PORT});
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: account.email,
			subject: "Confirm registration",
			html: html
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
	function sendInvoiceEmail(email, firstName, invoiceNumber) {
		var mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Invoice " + invoiceNumber,
			attachments: [{filename: "invoice_" + invoiceNumber, path: path.join(__dirname, "../invoices/invoice_" + invoiceNumber + ".pdf"), contentType: "application/pdf"}],
			html: "<html>" +
				"<body>" +
				"<p>Dear <b>" + firstName + "</b>,</p>" +
				"<p>thank you for buying at MyShop. You can find your invoice as attachment.<br>" +
				"If you have any questions, feel free to contact us.</p>" +
				"<p>Kind regards,<br/> your Admin Team</p>" +
				"</body>" +
				"</html>"
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
    return emailEvent;
}