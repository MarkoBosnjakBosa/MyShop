module.exports = function(app, models, path) {
    const Order = models.Order;
    const User = models.User;
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
    app.get("/getOrder/:orderId", (request, response) => {
        var orderId = request.params.orderId;
        var query = {_id: orderId};
        Order.findOne(query).then(order => {
            response.status(200).json({order: order}).end();
        }).catch(error => console.log(error));
    });
    app.get("/downloadInvoice/:orderNumber", (request, response) => {
        var orderNumber = request.params.orderNumber;
        if(orderNumber) {
            var invoice = path.join(__dirname, "../invoices/Invoice_" + orderNumber + ".pdf");
            response.download(invoice);
        } else {
            response.status(200).json({downloaded: false}).end();
        }
    });
}