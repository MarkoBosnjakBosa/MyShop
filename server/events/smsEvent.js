module.exports = function(EventEmitter, vonage) {
    const smsEvent = new EventEmitter();
    smsEvent.on("sendAuthenticationToken", (mobileNumber, firstName, authenticationToken) => {
        const from = "MyShop";
        const to = mobileNumber;
        const text = "Dear " + firstName + ", thank you for using MyShop. Your authentication token is: " + authenticationToken + ".";
        vonage.message.sendSms(from, to, text);
    });
    smsEvent.on("sendAuthenticationEnablingToken", (mobileNumber, firstName, sendAuthenticationEnablingToken) => {
        const from = "MyShop";
        const to = mobileNumber;
        const text = "Dear " + firstName + ", thank you for using MyShop. In order to enable authentication, insert the following authentication token: " + sendAuthenticationEnablingToken + ".";
        vonage.message.sendSms(from, to, text);
    });
    return smsEvent;
}