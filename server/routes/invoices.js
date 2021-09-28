module.exports = function(app, models, path) {
    const Invoice = models.Invoice;
    const User = models.User;
    app.post("/getInvoices", (request, response) => {
        var username = request.body.username;
        var userQuery = {"account.username": username};
        User.findOne(userQuery).then(user => {
            var query = {userId: user._id};
            var page = Number(request.body.page) - 1;
            var limit = 10;
            var skip = page * limit;
            var invoicesQuery = Invoice.find(query).skip(skip).limit(limit);
            var totalQuery = Invoice.find(query).countDocuments();
            var queries = [invoicesQuery, totalQuery];
            Promise.all(queries).then(results => {
                var total = results[1];
                var pagesNumber = 1;
                if(total >= limit) pagesNumber = Math.ceil(total / limit);
                response.status(200).json({invoices: results[0], total: total, pagesNumber: pagesNumber}).end();
            });
        }).catch(error => console.log(error));
    });
    app.get("/getInvoice/:invoiceId/:username", (request, response) => {
        var invoiceId = request.params.invoiceId;
        var username = request.params.username;
        var invoiceQuery = {_id: invoiceId};
        var userQuery = {"account.username": username};
        Invoice.findOne(invoiceQuery).then(invoice => {
            User.findOne(userQuery).then(user => {
                response.status(200).json({invoice: invoice, address: user.address}).end();
            }).catch(error => console.log(error));
        }).catch(error => console.log(error));
    });
    app.get("/downloadInvoice/:invoiceNumber", (request, response) => {
        var invoiceNumber = request.params.invoiceNumber;
        if(invoiceNumber) {
            var invoice = path.join(__dirname, "../invoices/Invoice_" + invoiceNumber + ".pdf");
            response.download(invoice);
        } else {
            response.status(200).json({downloaded: false}).end();
        }
    });
}