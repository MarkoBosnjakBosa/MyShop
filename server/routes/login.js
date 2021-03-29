module.exports = function(app, nexmo) {
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
}
