module.exports = function(mongoose) {
	const userScheme = new mongoose.Schema({
		username: String,
		email: String,
		password: String,
		firstName: String,
		lastName: String,
        mobileNumber: Number,
		address: String,
        postalCode: Number,
        city: String,
        country: String,
		accepted: Boolean,
		acceptanceToken: String,
        enableAuthentication: Boolean,
        authenticationCode: Number,
		isAdmin: Boolean
	});
    const models = {
		User: mongoose.model("User", userScheme)
	}
	return models;
}