module.exports = function(EventEmitter, transporter) {
    const emailEvent = new EventEmitter();
    emailEvent.on("sendConfirmationEmail", (email, firstName, username, acceptanceToken) => {
        sendConfirmationEmail(email, firstName, username, acceptanceToken); 
    });

    function sendConfirmationEmail(email, firstName, username, acceptanceToken) {
		var mailOptions = {
			from: emailUser,
			to: email,
			subject: "Confirm registration",
			html: "<html>" +
				"<body>" +
				"<p>Dear <b>" + firstName + "</b>,</p>" +
				"<p>thank you for using EasyChat. Click on the button below to proceed with your registration:" +
				"<p style='margin-bottom: 30px;'><a href='" + baseUrl + port + "/confirm/registration/?username=" + username + "&acceptanceToken=" + acceptanceToken + "' target='_blank' style=' background-color: #1a1aff; border: none; color: #fff; padding: 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; border-radius:5px;'>Confirm registration</a></p>" +
				"<p>Kind regards,<br/> your Admin Team</p>" +
				"</body>" +
				"</html>"
		};
		transporter.sendMail(mailOptions).then().catch(error => console.log(error));
	}
    return emailEvent;
}