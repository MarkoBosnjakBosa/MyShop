module.exports = function(app, models, nexmo) {
    const User = models.User;
    app.post("/checkUsername", (request, response) => {
		var username = request.body.username;
		if(username) {
			var query = {username: username};
			User.findOne(query).then(user => {
				if(!isEmpty(user)) {
					response.status(200).json({exists: true});
					response.end();
				} else {
					response.status(200).json({exists: false, empty: false});
					response.end();
				}
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({exists: false, empty: true});
			response.end();
		}
	});
    app.get("/send", (request, response) => {
        console.log("23");
		const from = 'Vonage APIs';
        const to = '491733857104';
        const text = 'Hello from Vonage SMS API';
        console.log("45");
        console.log(nexmo);
        nexmo.message.sendSms(from, to, text);
        response.status(200).json({artists: "success"});
        response.end();
        console.log("46");
	});

    function isEmpty(object) {
		return !object || Object.keys(object).length === 0;
 	}
}
