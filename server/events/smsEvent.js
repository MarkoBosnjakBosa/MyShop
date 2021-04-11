module.exports = function(EventEmitter, nexmo) {
    const smsEvent = new EventEmitter();
    smsEvent.on("sendAuthenticationToken", (mobileNumber, firstName, authenticationToken) => {
        const from = "MyShop";
        const to = mobileNumber;
        const text = "Dear " + firstName + ", thank you for using MyShop. Your authentication token is: " + authenticationToken + ".";
        nexmo.message.sendSms(from, to, text);
    });
    return smsEvent;
}