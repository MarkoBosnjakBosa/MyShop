module.exports = function(mongoose) {
	const userScheme = new mongoose.Schema({
		username: {type: String, required: true, index: {unique: true}},
		email: {type: String, required: true, index: {unique: true}},
		password: {type: String, required: true},
		firstName: {type: String, required: true},
		lastName: {type: String, required: true},
        mobileNumber: {type: Number, required: true, index: {unique: true}},
		street: {type: String, required: true},
		houseNumber: {type: Number, required: true},
        city: {type: String, required: true},
        zipCode: {type: Number, required: true},
        country: {type: String, required: true},
		accepted: {type: Boolean, required: true},
		acceptanceToken: {type: String, required: true},
        authenticationEnabled: {type: Boolean, required: true},
        authenticationToken: {type: String},
		isAdmin: {type: Boolean, required: true}
	});
    const models = {
		User: mongoose.model("User", userScheme)
	}
	return models;
}