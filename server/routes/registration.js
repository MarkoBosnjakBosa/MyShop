module.exports = function(app, reCaptchav2SecretKey, axios, bcryptjs, models, transporter, emailUser, baseUrl, port) {
    app.post("/createUser", (request, response) => {
        var reCaptchaToken = request.body.reCaptchaToken;
        if(reCaptchaToken == "" || reCaptchaToken == undefined || reCaptchaToken == null) {
            response.status(400).json({artists: "error"});
            response.end();
        } else {
            var reCaptchaVerificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + reCaptchav2SecretKey + "&response=" + reCaptchaToken + "&remoteip=" + request.connection.remoteAddress;
            axios.get(reCaptchaVerificationUrl).then(reCaptchaResponse => {
                if(reCaptchaResponse.data.success) {
                    response.status(200).json({artists: "success"});
                    response.end();
                } else {
                    response.status(400).json({artists: "error2"});
                    response.end();
                }
            }).catch(error => console.log(error));
        }
    });
}