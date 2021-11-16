module.exports = function(EventEmitter, vonage) {
    const smsEvent = new EventEmitter();
    smsEvent.on("sendAuthenticationToken", (mobileNumber, firstName, authenticationToken) => {
        const from = "MyShop";
        const to = mobileNumber;
        const text = "Dear " + firstName + ", thank you for using MyShop. Your authentication token is: " + authenticationToken + ". The authentication token is valid for the next 5 minutes.";
        vonage.message.sendSms(from, to, text, (error, responseData) => {});
    });
    smsEvent.on("sendAuthenticationEnablingToken", (mobileNumber, firstName, authenticationEnablingToken) => {
        const from = "MyShop";
        const to = mobileNumber;
        const text = "Dear " + firstName + ", thank you for using MyShop. In order to enable authentication, please insert the following authentication token: " + authenticationEnablingToken + ". The authentication token is valid for the next 5 minutes.";
        vonage.message.sendSms(from, to, text, (error, responseData) => {});
    });
    return smsEvent;
}