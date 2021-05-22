module.exports = function(app, stripe) {
	app.post("/stripe/checkout", (request, response) => {
		var line_items = JSON.parse(request.body.line_items);
		var options = {payment_method_types: ["card"], line_items: line_items, mode: "payment", success_url: process.env.CHECKOUT_SUCCESS, cancel_url: process.env.CHECKOUT_CANCEL};
		stripe.checkout.sessions.create(options).then(session => {
			response.status(200).json({sessionId: session.id}).end();
		});
	});
	app.post("/finalizePayment", (request, response) => {
		var username = request.body.username;
		var products = JSON.parse(request.body.products);
		
		response.status(200).json({finalized: true}).end();
	});
}