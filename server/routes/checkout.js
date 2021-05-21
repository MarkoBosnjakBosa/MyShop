module.exports = function(app, stripe) {
    app.post("/stripe/checkout", async (request, response) => {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "eur",
                  product_data: {
                    name: 'Stubborn Attachments',
                    images: ['https://i.imgur.com/EHyR2nP.png'],
                  },
                  unit_amount: 2000,
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: "https://www.google.com",
            cancel_url: "https://www.index.hr",
          });
          response.status(200).json({sessionId: session.id}).end();
    });
}