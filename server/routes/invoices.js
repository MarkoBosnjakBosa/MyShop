module.exports = function(app, models, path) {
    const Invoice = models.Invoice;
    app.get("/downloadInvoice/:invoiceNumber", function(request, response) {
        var invoiceNumber = request.params.invoiceNumber;
        if(invoiceNumber != "") {
            var invoice = path.join(__dirname, "../invoices/invoice_" + invoiceNumber + ".pdf");
            response.download(invoice);
        } else {
            response.status(200).json({downloaded: false}).end();
        }
    });
}