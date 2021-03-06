module.exports = function(app, models, json2csv, ejs, pdf, fs, path, emailEvents, checkStatus, checkPermission, validations) {
	const Order = models.Order;
	const User = models.User;
	app.post("/getOrders", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
		var search = request.body.search;
		var type = request.body.type;
		var page = Number(request.body.page) - 1;
		var limit = (Number.isInteger(request.body.limit) && Number(request.body.limit) > 0) ? Number(request.body.limit) : 1;
		var skip = page * limit;
		var orderBy = request.body.orderBy;
		var sort = {};
		switch(orderBy) {
			case "orderNumberAsc":
				sort = {orderNumber: 1};
				break;
			case "orderNumberDesc":
				sort = {orderNumber: -1};
				break;
			case "paymentTypeAsc":
				sort = {paymentType: 1};
				break;
			case "paymentTypeDesc":
				sort = {paymentType: -1};
				break;
			case "createdAtAsc":
				sort = {createdAt: 1};
				break;
			case "createdAtDesc":
				sort = {createdAt: -1};
				break;
			case "dispatchedAtAsc":
				sort = {dispatchedAt: 1};
				break;
			case "dispatchedDesc":
				sort = {dispatchedAt: -1};
				break;
			default:
				sort = {};
		}
		var typeQuery = {};
		switch(type) {
			case "dispatched":
				typeQuery = {isDispatched: true};
				break;
			case "notDispatched":
				typeQuery = {isDispatched: false};
				break;
			case "creditCard":
				typeQuery = {paymentType: "Credit card"};
				break;
			case "payPal":
				typeQuery = {paymentType: "PayPal"};
				break;
			default:
				typeQuery = {};
		}
		var query;
		if(isNaN(search)) {
			query = search ? {$and: [typeQuery, {$or: [{"user.account.username": {$regex: search, $options: "i" }}, {"user.account.email": {$regex: search, $options: "i"}}, {"user.account.firstName": {$regex: search, $options: "i"}}, {"user.account.lastName": {$regex: search, $options: "i"}}, {"user.account.mobileNumber": {$regex: search, $options: "i" }}]}]} : typeQuery;
		} else {
			query = search ? {$and: [typeQuery, {orderNumber: search}]} : typeQuery;
		}
		var ordersQuery = Order.find(query).sort(sort).skip(skip).limit(limit);
		var totalQuery = Order.find(query).countDocuments();
		var queries = [ordersQuery, totalQuery];
		Promise.all(queries).then(results => {
			var total = results[1];
			var pagesNumber = 1;
			if(total >= limit) pagesNumber = Math.ceil(total / limit);
			response.status(200).json({orders: results[0], total: total, pagesNumber: pagesNumber}).end();
		}).catch(error => console.log(error));
	});
	app.post("/getUserOrders", checkStatus.isLoggedIn, (request, response) => {
		var username = request.body.username;
		var userQuery = {"account.username": username};
		User.findOne(userQuery).then(user => {
			var query = {userId: user._id};
			var page = Number(request.body.page) - 1;
			var limit = 10;
			var skip = page * limit;
			var ordersQuery = Order.find(query).skip(skip).limit(limit);
			var totalQuery = Order.find(query).countDocuments();
			var queries = [ordersQuery, totalQuery];
			Promise.all(queries).then(results => {
				var total = results[1];
				var pagesNumber = 1;
				if(total >= limit) pagesNumber = Math.ceil(total / limit);
				response.status(200).json({orders: results[0], total: total, pagesNumber: pagesNumber}).end();
			}).catch(error => console.log(error));
		}).catch(error => console.log(error));
	});
	app.get("/getOrder/:orderId", checkStatus.isLoggedIn, (request, response) => {
		var orderId = request.params.orderId;
		var query = {_id: orderId};
		Order.findOne(query).then(order => {
			response.status(200).json({order: order}).end();
		}).catch(error => {
			console.log(error);
			response.status(404).end();
		});
	});
	app.put("/dispatchOrder", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
		var orderId = request.body.orderId;
		var dispatchedAt = new Date().getTime();
		var orderQuery = {_id: orderId};
		var update = {isDispatched: true, dispatchedAt: dispatchedAt};
		var options = {new: true};
		Order.findOneAndUpdate(orderQuery, update, options).then(order => {
			if(!validations.isEmpty(order)) {
				var userQuery = {_id: order.userId};
				User.findOne(userQuery).then(user => {
					if(!validations.isEmpty(user)) {
						emailEvents.emit("sendOrderDispatchedEmail", user.account, order.orderNumber, order._id);
						response.status(200).json({isDispatched: true, dispatchedAt: dispatchedAt}).end();
					} else {
						response.status(200).json({isDispatched: false}).end();
					}
				}).catch(error => console.log(error));
			} else {
				response.status(200).json({isDispatched: false}).end();
			}
		}).catch(error => console.log(error));
	});
	app.delete("/deleteOrder/:orderId", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
		var orderId = request.params.orderId;
		var query = {_id: orderId};
		Order.findOneAndDelete(query).then(order => {
			if(!validations.isEmpty(order)) {
				response.status(200).json({deleted: true}).end();
			} else {
				response.status(200).json({deleted: false}).end(); 
			}
		}).catch(error => console.log(error));
	});
	app.get("/downloadInvoice/:orderId", checkStatus.isLoggedIn, (request, response) => {
		var orderId = request.params.orderId;
		var orderQuery = {_id: orderId};
		Order.findOne(orderQuery).then(order => {
			if(!validations.isEmpty(order)) {
				var products = order.products.map(product => {
					var updatedProduct = {};
					updatedProduct.title = product.title;
					updatedProduct.price = formatNumber(product.price);
					updatedProduct.selectedQuantity = product.selectedQuantity;
					updatedProduct.totalPrice = formatNumber(product.price * product.selectedQuantity);
					return updatedProduct;
				});
				var htmlCompiled = ejs.compile(fs.readFileSync(path.join(__dirname, "../../templates/invoice/invoice.html"), "UTF-8"));
				var html = htmlCompiled({order: order, products: products});
				var filePath = path.join(__dirname, "../../temporary/Invoice_" + order.orderNumber + ".pdf");
				pdf.create(html).toFile(filePath, function(error, result) {
					setTimeout(function() { 
						if(fs.existsSync(filePath)) {
							fs.unlinkSync(filePath);
						}
					}, 30000);
					response.status(200).json({downloaded: true, fileName: "Invoice_" + order.orderNumber + ".pdf"}).end();
				});
			} else {
				response.status(200).json({downloaded: false}).end();
			}
		}).catch(error => console.log(error));
	});
	app.post("/downloadOrders", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
		var search = request.body.search;
		var type = request.body.type;
		var page = Number(request.body.page) - 1; 
		var limit = (Number.isInteger(request.body.limit) && Number(request.body.limit) > 0) ? Number(request.body.limit) : 1;
		var skip = page * limit;
		var orderBy = request.body.orderBy;
		var sort = {};
		switch(orderBy) {
			case "orderNumberAsc":
				sort = {orderNumber: 1};
				break;
			case "orderNumberDesc":
				sort = {orderNumber: -1};
				break;
			case "paymentTypeAsc":
				sort = {paymentType: 1};
				break;
			case "paymentTypeDesc":
				sort = {paymentType: -1};
				break;
			case "createdAtAsc":
				sort = {createdAt: 1};
				break;
			case "createdAtDesc":
				sort = {createdAt: -1};
				break;
			case "dispatchedAtAsc":
				sort = {dispatchedAt: 1};
				break;
			case "dispatchedAtDesc":
				sort = {dispatchedAt: -1};
				break;
			default:
				sort = {};
		}
		var typeQuery = {};
		switch(type) {
			case "dispatched":
				typeQuery = {isDispatched: true};
				break;
			case "notDispatched":
				typeQuery = {isDispatched: false};
				break;
			case "creditCard":
				typeQuery = {paymentType: "Credit card"};
				break;
			case "payPal":
				typeQuery = {paymentType: "PayPal"};
				break;
			default:
				typeQuery = {};
		}
		var query;
		if(isNaN(search)) {
			query = search ? {$and: [typeQuery, {$or: [{"user.account.username": {$regex: search, $options: "i" }}, {"user.account.email": {$regex: search, $options: "i"}}, {"user.account.firstName": {$regex: search, $options: "i"}}, {"user.account.lastName": {$regex: search, $options: "i"}}, {"user.account.mobileNumber": {$regex: search, $options: "i" }}]}]} : typeQuery;
		} else {
			query = search ? {$and: [typeQuery, {orderNumber: search}]} : typeQuery;
		}
		Order.find(query).sort(sort).skip(skip).limit(limit).then(orders => {
			if(!validations.isEmpty(orders)) {
				var fields = ["_id", "orderNumber", "userId", "paymentType", "totalPrice", "createdAt", "isDispatched", "dispatchedAt"];
				var csv;
				try {
					csv = json2csv(orders, {fields});
					var timestamp = new Date().getTime();
					var filePath = path.join(__dirname, "../../temporary/Orders_" + timestamp + ".csv");
					fs.promises.writeFile(filePath, csv).then(csvFile => {
						setTimeout(function() { fs.unlinkSync(filePath); }, 30000);
						response.status(200).json({downloaded: true, fileName: "Orders_" + timestamp + ".csv"});
					}).catch(error => console.log(error));
				} catch(error) {
					response.status(200).json({downloaded: false}).end(); 
				}
			} else {
				response.status(200).json({downloaded: false}).end(); 
			}
		}).catch(error => console.log(error));
	});

	function formatNumber(number) {
		return Number(number).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " ???";
	}
}