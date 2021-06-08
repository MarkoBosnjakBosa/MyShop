module.exports = function(EventEmitter, vonage) {
    const smsEvent = new EventEmitter();
    smsEvent.on("sendAuthenticationToken", (mobileNumber, firstName, authenticationToken) => {
        const from = "MyShop";
        const to = mobileNumber;
        const text = "Dear " + firstName + ", thank you for using MyShop. Your authentication token is: " + authenticationToken + ". The authentication token is valid for the next 5 minutes.";
        vonage.message.sendSms(from, to, text);
    });
    smsEvent.on("sendAuthenticationEnablingToken", (mobileNumber, firstName, sendAuthenticationEnablingToken) => {
        const from = "MyShop";
        const to = mobileNumber;
        const text = "Dear " + firstName + ", thank you for using MyShop. In order to enable authentication, insert the following authentication token: " + sendAuthenticationEnablingToken + ". The authentication token is valid for the next 5 minutes.";
        vonage.message.sendSms(from, to, text);
    });
    return smsEvent;
}