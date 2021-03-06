module.exports = function(app, models, checkStatus, checkPermission, validations) {
	const User = models.User;
	const Message = models.Message;
	app.post("/getUsers", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
		var search = request.body.search;
		var page = Number(request.body.page) - 1; 
		var limit = (Number.isInteger(request.body.limit) && Number(request.body.limit) > 0) ? Number(request.body.limit) : 1;
		var skip = page * limit;
		var orderBy = request.body.orderBy;
		var sort = {};
		switch(orderBy) {
			case "usernameAsc":
				sort = {"account.username": 1};
				break;
			case "usernameDesc":
				sort = {"account.username": -1};
				break;
			case "emailAsc":
				sort = {"account.email": 1};
				break;
			case "emailDesc":
				sort = {"account.email": -1};
				break;
			default:
				sort = {};
		}
		var query = search ? {$and: [{"account.isAdmin": false}, {$or: [{"account.username": {$regex: search, $options: "i" }}, {"account.email": {$regex: search, $options: "i"}}, {"account.mobileNumber": {$regex: search, $options: "i"}}, {"account.firstName": {$regex: search, $options: "i"}}, {"account.lastName": {$regex: search, $options: "i"}}]}]} : {"account.isAdmin": false};
		var usersQuery = User.find(query).sort(sort).skip(skip).limit(limit);
		var totalQuery = User.find(query).countDocuments();
		var queries = [usersQuery, totalQuery];
		Promise.all(queries).then(results => {
			var total = results[1];
			var pagesNumber = 1;
			if(total >= limit) pagesNumber = Math.ceil(total / limit);
			response.status(200).json({users: results[0], total: total, pagesNumber: pagesNumber}).end();
		}).catch(error => console.log(error));
	});
	app.get("/getUserById/:userId", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
		var userId = request.params.userId;
		var query = {_id: userId};
		User.findOne(query).then(user => {
			user.account.password = null;
			user.account.isAdmin = null;
			response.status(200).json({account: user.account, address: user.address}).end();
		}).catch(error => {
			console.log(error);
			response.status(404).end();
		});
	});
	app.delete("/deleteUser/:userId", [checkStatus.isLoggedIn, checkPermission.isAdmin], (request, response) => {
		var userId = request.params.userId;
		var userQuery = {_id: userId};
		User.findOneAndDelete(userQuery).then(user => {
			if(!validations.isEmpty(user)) {
				var messagesQuery = {chatId: user.account.username};
				Message.deleteMany(messagesQuery).then(messages => {
					response.status(200).json({deleted: true}).end();
				}).catch(error => console.log(error));
			} else {
				response.status(200).json({deleted: false}).end(); 
			}
		}).catch(error => console.log(error));
	});
}