module.exports = function(app, models, moment, json2csv, fs, path, emailEvents, validations) {
    const Order = models.Order;
    const User = models.User;
    app.post("/getOrders", (request, response) => {
        var search = request.body.search;
		var type = request.body.type;
		var page = Number(request.body.page) - 1; 
		var limit = Number(request.body.limit);
		var skip = page * limit;
		var orderBy = request.body.orderBy;
		var sort = {};
		switch(orderBy) {
			case "orderNumberAsc":
				sort = {"orderNumber": 1};
				break;
			case "orderNumberDesc":
				sort = {"orderNumber": -1};
				break;
			case "paymentTypeAsc":
				sort = {"paymentType": 1};
				break;
			case "paymentTypeDesc":
				sort = {"paymentType": -1};
				break;
			case "createdAsc":
				sort = {"created": 1};
				break;
			case "createdDesc":
				sort = {"created": -1};
				break;
            case "dispatchedAsc":
                sort = {"dispatched": 1};
                break;
            case "dispatchedDesc":
                sort = {"dispatched": -1};
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
        var query = search ? {$and: [typeQuery, {$or: [{orderNumber: {$regex: search, $options: "i" }}, {"user.account.username": {$regex: search, $options: "i" }}, {"user.account.email": {$regex: search, $options: "i"}}, {"user.account.firstName": {$regex: search, $options: "i"}}, {"user.account.lastName": {$regex: search, $options: "i"}}, {"user.account.mobileNumber": {$regex: search, $options: "i" }}]}]} : typeQuery;
		var ordersQuery = Order.find(query).sort(sort).skip(skip).limit(limit);
		var totalQuery = Order.find(query).countDocuments();
		var queries = [ordersQuery, totalQuery];
		Promise.all(queries).then(results => {
			var total = results[1];
			var pagesNumber = 1;
			if(total >= limit) pagesNumber = Math.ceil(total / limit);
			response.status(200).json({orders: results[0], total: total, pagesNumber: pagesNumber}).end();
		});
    });
    app.post("/getUserOrders", (request, response) => {
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
            });
        }).catch(error => console.log(error));
    });
    app.post("/downloadOrders", (request, response) => {
		var search = request.body.search;
		var type = request.body.type;
		var page = Number(request.body.page) - 1; 
		var limit = Number(request.body.limit);
		var skip = page * limit;
		var orderBy = request.body.orderBy;
		var sort = {};
		switch(orderBy) {
			case "orderNumberAsc":
				sort = {"orderNumber": 1};
				break;
			case "orderNumberDesc":
				sort = {"orderNumber": -1};
				break;
			case "paymentTypeAsc":
				sort = {"paymentType": 1};
				break;
			case "paymentTypeDesc":
				sort = {"paymentType": -1};
				break;
			case "createdAsc":
				sort = {"created": 1};
				break;
			case "createdDesc":
				sort = {"created": -1};
				break;
            case "dispatchedAsc":
                sort = {"dispatched": 1};
                break;
            case "dispatchedDesc":
                sort = {"dispatched": -1};
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
        var query = search ? {$and: [typeQuery, {$or: [{orderNumber: {$regex: search, $options: "i" }}, {"user.account.username": {$regex: search, $options: "i" }}, {"user.account.email": {$regex: search, $options: "i"}}, {"user.account.firstName": {$regex: search, $options: "i"}}, {"user.account.lastName": {$regex: search, $options: "i"}}, {"user.account.mobileNumber": {$regex: search, $options: "i" }}]}]} : typeQuery;
		Order.find(query).sort(sort).skip(skip).limit(limit).then(orders => {
			if(!validations.isEmpty(orders)) {
				var fields = ["_id", "orderNumber", "userId", "paymentType", "totalPrice", "created", "isDispatched", "dispatched"];
				var csv;
				try {
					csv = json2csv(orders, {fields});
					var timestamp = moment(new Date());
					var filePath = path.join(__dirname, "../../exports/Orders_" + timestamp + ".csv");
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
    app.get("/getOrder/:orderId", (request, response) => {
        var orderId = request.params.orderId;
        var query = {_id: orderId};
        Order.findOne(query).then(order => {
            response.status(200).json({order: order}).end();
        }).catch(error => console.log(error));
    });
	app.put("/dispatchOrder",(request, response) => {
		var orderId = request.body.orderId;
		var dateAndTimeFormat = "DD.MM.YYYY HH:mm";
		var dispatched = moment().format(dateAndTimeFormat);
		var orderQuery = {_id: orderId};
		var update = {isDispatched: true, dispatched: dispatched};
		Order.findOneAndUpdate(orderQuery, update).then(order => {
			if(!validations.isEmpty(order)) {
				var userQuery = {_id: order.userId};
				User.findOne(userQuery).then(user => {
					if(!validations.isEmpty(user)) {
						emailEvents.emit("sendOrderDispatchedEmail", user.account, order.orderNumber, order._id);
						response.status(200).json({isDispatched: true, dispatched: dispatched}).end();
					} else {
						response.status(200).json({isDispatched: false}).end();
					}
				}).catch(error => console.log(error));
			} else {
				response.status(200).json({isDispatched: false}).end();
			}
        }).catch(error => console.log(error));
	});
    app.get("/downloadInvoice/:orderNumber", (request, response) => {
        var orderNumber = request.params.orderNumber;
        if(orderNumber) {
            var invoice = path.join(__dirname, "../../invoices/Invoice_" + orderNumber + ".pdf");
            response.download(invoice);
        } else {
            response.status(200).json({downloaded: false}).end();
        }
    });
}