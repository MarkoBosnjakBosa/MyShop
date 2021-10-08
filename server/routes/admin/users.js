module.exports = function(app, models, validations) {
    const User = models.User;
    app.post("/getUsers", (request, response) => {
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
			case "mobileNumberAsc":
				sort = {"account.mobileNumber": 1};
				break;
			case "mobileNumberDesch":
				sort = {"account.mobileNumber": -1};
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
		});
	});
    app.get("/getUserById/:userId", (request, response) => {
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
	app.delete("/deleteUser/:userId", (request, response) => {
		var userId = request.params.userId;
		if(userId) {
			var query = {_id: userId};
			User.findOneAndRemove(query).then(user => {
				if(!validations.isEmpty(user)) {
                    response.status(200).json({deleted: true}).end();
				} else {
					response.status(200).json({deleted: false}).end(); 
				}
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({deleted: false}).end();
		}
	});
}