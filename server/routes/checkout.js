module.exports = function(app, models, stripe, moment, fs, path, ejs, pdf) {
	const Invoice = models.Invoice;
	const User = models.User;
	const Product = models.Product;
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
		var query = {username: username};
		User.findOne(query).then(user => {
			Invoice.countDocuments().then(count => {
				var invoiceNumber = ++count;
				var newInvoice = getInvoiceScheme(Invoice, invoiceNumber, username, products, date);
				newInvoice.save().then(invoice => {
					createInvoicePdf(invoiceNumber, date, "credit card", user, products, totalPrice);
					updateQuantities(products);
					response.status(200).json({finalized: true, invoiceNumber: invoiceNumber}).end();
				}).catch(error => console.error(error));
			}).catch(error => console.error(error));
		}).catch(error => console.error(error));
	});

	function getInvoiceScheme(Invoice, invoiceNumber, username, products, date) {
		return new Invoice({invoiceNumber: invoiceNumber, username: username, products: products, date: date});
	}
	function createInvoicePdf(invoiceNumber, date, paymentMethod, user, products, totalPrice) {
		products = products.map(product => {
			var updatedProduct = {};
			updatedProduct.title = product.title;
			updatedProduct.price = formatNumber(product.price);
			updatedProduct.selectedQuantity = product.selectedQuantity;
			updatedProduct.totalPrice = formatNumber(product.price * product.selectedQuantity);
			return updatedProduct;
		});
		var htmlCompiled = ejs.compile(fs.readFileSync(path.join(__dirname, "../invoices/template/invoice.html"), "utf-8"));
		var html = htmlCompiled({invoiceNumber: invoiceNumber, date: date, paymentMethod: paymentMethod, user: user, products: products, totalPrice: totalPrice});
		pdf.create(html).toFile(path.join(__dirname, "../invoices/invoice_" + invoiceNumber + ".pdf"), function(error, response) {});
	}
	function updateQuantities(products) {
		products.forEach(product => {
			var query = {_id: product._id};
			var options = {$inc: {quantity: -product.selectedQuantity}};
			Product.findOneAndUpdate(query, options).then().catch(error => console.log(error));
		});
	}
	function formatNumber(number) {
		number = number.toString();
		if(number.includes(".")) {
			var decimalPart = number.substr(number.lastIndexOf(".") + 1);
			if(decimalPart.length == 1){
				number = number + "0";
			}
		} else {
			number = number + ".00";
		}
		return Number(number).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €";
	}
}