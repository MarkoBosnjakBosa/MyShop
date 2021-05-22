module.exports = function(app, models, stripe, moment, fs, path, ejs, pdf) {
	const Invoice = models.Invoice;
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
		var totalPrice = request.body.totalPrice;
		var date = moment(new Date()).format("DD.MM.YYYY HH:mm");
		Invoice.countDocuments().then(count => {
			var invoiceNumber = ++count;
			var newInvoice = getInvoiceScheme(Invoice, invoiceNumber, username, products, date);
			newInvoice.save().then(invoice => {
				var htmlCompiled = ejs.compile(fs.readFileSync(path.join(__dirname, "../invoices/template/invoice.html"), "utf-8"));
				var html = htmlCompiled({invoiceNumber: invoiceNumber, date: date, paymentMethod: "credit card", products: products, totalPrice: totalPrice});
				pdf.create(html).toFile(path.join(__dirname, "../invoices/test.pdf"), function(error, pdfResponse) {});
				response.status(200).json({finalized: true}).end();
			}).catch(error => console.error(error));
		}).catch(error => console.error(error));
	});

	function getInvoiceScheme(Invoice, invoiceNumber, username, products, date) {
		return new Invoice({invoiceNumber: invoiceNumber, username: username, products: products, date: date});
	}
}