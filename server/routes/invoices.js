module.exports = function(app, models, path) {
    const Invoice = models.Invoice;
    app.post("/getInvoices", (request, response) => {
        var username = request.body.username;
        var page = Number(request.body.page) - 1;
		var limit = 10;
		var skip = page * limit;
		var query = {username: username};
		var invoicesQuery = Invoice.find(query).skip(skip).limit(limit);
		var totalQuery = Invoice.find(query).countDocuments();
		var queries = [invoicesQuery, totalQuery];
		Promise.all(queries).then(results => {
			var total = results[1];
			var pagesNumber = 1;
			if(total >= limit) pagesNumber = Math.ceil(total / limit);
			response.status(200).json({invoices: results[0], total: total, pagesNumber: pagesNumber}).end();
		});
    });
    app.get("/downloadInvoice/:invoiceNumber", (request, response) => {
        var invoiceNumber = request.params.invoiceNumber;
        if(invoiceNumber != "") {
            var invoice = path.join(__dirname, "../invoices/invoice_" + invoiceNumber + ".pdf");
            response.download(invoice);
        } else {
            response.status(200).json({downloaded: false}).end();
        }
    });
}