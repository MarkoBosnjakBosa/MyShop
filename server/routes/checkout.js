module.exports = function(app, models, stripe, moment, ejs, pdf, fs, path, emailEvent) {
	const Order = models.Order;
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
		var createdAt = moment(new Date()).format("DD.MM.YYYY HH:mm");
		var query = {"account.username": username};
		User.findOne(query).then(user => {
			user.account.password = null;
			user.account.isAdmin = null;
			Order.countDocuments().then(count => {
				var orderNumber = ++count;
				var newOrder = getOrderScheme(Order, orderNumber, user._id, paymentType, products, totalPrice, createdAt, false, "", {account: user.account, address: user.address});
				newOrder.save().then(order => {
					createInvoice(orderNumber, createdAt, paymentType, user, products, totalPrice);
					updateQuantities(products);
					response.status(200).json({finalized: true, orderNumber: orderNumber}).end();
				}).catch(error => console.error(error));
			}).catch(error => console.error(error));
		}).catch(error => console.error(error));
	});

	function createInvoice(orderNumber, createdAt, paymentType, user, products, totalPrice) {
		products = products.map(product => {
			var updatedProduct = {};
			updatedProduct.title = product.title;
			updatedProduct.price = formatNumber(product.price);
			updatedProduct.selectedQuantity = product.selectedQuantity;
			updatedProduct.totalPrice = formatNumber(product.price * product.selectedQuantity);
			return updatedProduct;
		});
		var htmlCompiled = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/invoice/invoice.html"), "utf-8"));
		var html = htmlCompiled({orderNumber: orderNumber, createdAt: createdAt, paymentType: paymentType, user: user, products: products, totalPrice: totalPrice});
		pdf.create(html).toFile(path.join(__dirname, "../invoices/Invoice_" + orderNumber + ".pdf"), function(error, response) {
			emailEvent.emit("sendInvoiceEmail", user.account, orderNumber);
		});
	}
	function updateQuantities(products) {
		products.forEach(product => {
			var query = {_id: product._id, quantity: {$gte: product.selectedQuantity}};
			var options = {$inc: {quantity: -product.selectedQuantity}};
			Product.findOneAndUpdate(query, options).then().catch(error => console.log(error));
		});
	}
	function formatNumber(number) {
		return Number(number).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €";
	}
	function getOrderScheme(Order, orderNumber, userId, paymentType, products, totalPrice, createdAt, isDispatched, dispatchedAt, user) {
		return new Order({orderNumber: orderNumber, userId: userId, paymentType: paymentType, products: products, totalPrice: totalPrice, createdAt: createdAt, isDispatched: isDispatched, dispatchedAt: dispatchedAt, user: user});
	}
}