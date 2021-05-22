module.exports = function(app, stripe, fs, path, ejs, pdf) {
	app.post("/stripe/checkout", (request, response) => {
		var line_items = JSON.parse(request.body.line_items);
		var options = {payment_method_types: ["card"], line_items: line_items, mode: "payment", success_url: process.env.CHECKOUT_SUCCESS, cancel_url: process.env.CHECKOUT_CANCEL};
		stripe.checkout.sessions.create(options).then(session => {
			response.status(200).json({sessionId: session.id}).end();
		});
	});
	app.post("/finalizePayment", (request, response) => {
		var username = request.body.username;
		var products = request.body.products;
		var htmlCompiled = ejs.compile(fs.readFileSync(path.join(__dirname, "../invoices/template/invoice.html"), "utf-8"));
		var html = htmlCompiled({title: 'EJS', text: 'Hello, World!'});
		pdf.create(html).toFile(path.join(__dirname, "../invoices/test.pdf"), function(error, pdfResponse) {});
		response.status(200).json({finalized: true}).end();
	});
}