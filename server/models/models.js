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
		acceptanceToken: {type: String},
        authenticationEnabled: {type: Boolean, required: true},
        authenticationToken: {type: String},
		authenticationEnablingToken: {type: String},
		isAdmin: {type: Boolean, required: true}
	});
	const productScheme = new mongoose.Schema({
		title: {type: String, required: true},
		description: {type: String, required: true},
		price: {type: Number, required: true},
		categoryId: {type: Number, required: true},
		technicalData: {type: Array, required: true},
        review: {type: String}
	});
	const technicalDataScheme = new mongoose.Schema({
		title: {type: String, required: true}
	});
	const categoryScheme = new mongoose.Schema({
		title: {type: String, required: true}
	});
    const models = {
		User: mongoose.model("User", userScheme),
		Product: mongoose.model("Product", productScheme),
		TechnicalData: mongoose.model("TechnicalData", technicalDataScheme),
		Category: mongoose.model("Category", categoryScheme)
	}
	return models;
}