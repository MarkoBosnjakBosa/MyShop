module.exports = function(app, models, stripe, moment, fs, path, ejs, pdf, emailEvent) {
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
		var paymentType = request.body.paymentType;
		var products = request.body.products;
		var totalPrice = request.body.totalPrice;
		var created = moment(new Date()).format("DD.MM.YYYY HH:mm");
		var query = {"account.username": username};
		User.findOne(query).then(user => {
			Invoice.countDocuments().then(count => {
				var invoiceNumber = ++count;
				var newInvoice = getInvoiceScheme(Invoice, invoiceNumber, username, paymentType, products, totalPrice, created);
				newInvoice.save().then(invoice => {
					createInvoicePdf(invoiceNumber, created, paymentType, user, products, totalPrice);
					updateQuantities(products);
					response.status(200).json({finalized: true, invoiceNumber: invoiceNumber}).end();
				}).catch(error => console.error(error));
			}).catch(error => console.error(error));
		}).catch(error => console.error(error));
	});

	function createInvoicePdf(invoiceNumber, created, paymentType, user, products, totalPrice) {
		products = products.map(product => {
			var updatedProduct = {};
			updatedProduct.title = product.title;
			updatedProduct.price = formatNumber(product.price);
			updatedProduct.selectedQuantity = product.selectedQuantity;
			updatedProduct.totalPrice = formatNumber(product.price * product.selectedQuantity);
			return updatedProduct;
		});
		var htmlCompiled = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/invoice/invoice.html"), "utf-8"));
		var html = htmlCompiled({invoiceNumber: invoiceNumber, created: created, paymentType: paymentType, user: user, products: products, totalPrice: totalPrice});
		pdf.create(html).toFile(path.join(__dirname, "../invoices/invoice_" + invoiceNumber + ".pdf"), function(error, response) {
			emailEvent.emit("sendInvoiceEmail", user.account, invoiceNumber);
		});
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
	function getInvoiceScheme(Invoice, invoiceNumber, username, paymentType, products, totalPrice, created) {
		return new Invoice({invoiceNumber: invoiceNumber, username: username, paymentType: paymentType, products: products, totalPrice: totalPrice, created: created});
	}
}