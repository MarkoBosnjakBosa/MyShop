module.exports = function(app, models, stripe, ejs, pdf, fs, path, emailEvents, validations) {
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
		var createdAt = new Date().getTime();
		var userQuery = {"account.username": username};
		User.findOne(userQuery).then(user => {
			user.account.password = null;
			user.account.isAdmin = null;
			var orderQuery = {};
			var orderSort = {orderNumber: -1};
			Order.findOne(orderQuery).sort(orderSort).then(order => {
				var orderNumber = 1;
				if(!validations.isEmpty(order)) {
					orderNumber += Number(order.orderNumber);
				}
				var newOrder = getOrderScheme(Order, orderNumber, user._id, paymentType, products, totalPrice, createdAt, false, 0, {account: user.account, address: user.address});
				newOrder.save().then(createdOrder => {
					createInvoice(createdOrder, user);
					updateQuantities(products);
					response.status(200).json({finalized: true, orderId: createdOrder._id}).end();
				}).catch(error => console.error(error));
			}).catch(error => console.error(error));
		}).catch(error => console.error(error));
	});

	function createInvoice(order, user) {
		var products = order.products.map(product => {
			var updatedProduct = {};
			updatedProduct.title = product.title;
			updatedProduct.price = formatNumber(product.price);
			updatedProduct.selectedQuantity = product.selectedQuantity;
			updatedProduct.totalPrice = formatNumber(product.price * product.selectedQuantity);
			return updatedProduct;
		});
		var htmlCompiled = ejs.compile(fs.readFileSync(path.join(__dirname, "../templates/invoice/invoice.html"), "UTF-8"));
		var html = htmlCompiled({order: order, products: products, user: user});
		var filePath = path.join(__dirname, "../temporary/Invoice_" + order.orderNumber + ".pdf");
		pdf.create(html).toFile(path.join(filePath), function(error, response) {
			setTimeout(function() { fs.unlinkSync(filePath); }, 30000);
			emailEvents.emit("sendInvoiceEmail", user.account, order.orderNumber);
		});
	}
	function updateQuantities(products) {
		products.forEach(product => {
			var query = {_id: product._id};
			var update = [{$set: {"quantity": {$cond: [{$gt: [{$subtract: ["$quantity", Number(product.selectedQuantity)]}, 0]}, {$subtract: ["$quantity", Number(product.selectedQuantity)]}, 0]}}}];
			var options = {new: true};
			Product.findOneAndUpdate(query, update, options).then().catch(error => console.log(error));
		});
	}
	function formatNumber(number) {
		return Number(number).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €";
	}
	function getOrderScheme(Order, orderNumber, userId, paymentType, products, totalPrice, createdAt, isDispatched, dispatchedAt, user) {
		return new Order({orderNumber: orderNumber, userId: userId, paymentType: paymentType, products: products, totalPrice: totalPrice, createdAt: createdAt, isDispatched: isDispatched, dispatchedAt: dispatchedAt, user: user});
	}
}