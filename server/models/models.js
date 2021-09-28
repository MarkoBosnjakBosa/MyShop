module.exports = function(mongoose) {
	const userScheme = new mongoose.Schema({
		account: {
			username: {type: String, required: true, index: {unique: true}},
			email: {type: String, required: true, index: {unique: true}},
			password: {type: String, required: true},
			firstName: {type: String, required: true},
			lastName: {type: String, required: true},
			mobileNumber: {type: String, required: true, index: {unique: true}},
			isAdmin: {type: Boolean, required: true}
		},
		address: {
			street: {type: String, required: true},
			houseNumber: {type: Number, required: true},
			city: {type: String, required: true},
			zipCode: {type: Number, required: true},
			country: {type: String, required: true}
		},
		confirmation: {
			confirmed: {type: Boolean, required: true},
			confirmationToken: {type: String},
			authenticationEnabled: {type: Boolean, required: true},
			authenticationToken: {type: String},
			authenticationEnablingToken: {type: String},
			resetPasswordToken: {type: String}
		}
	});
	const productScheme = new mongoose.Schema({
		title: {type: String, required: true},
		description: {type: String, required: true},
		price: {type: String, required: true},
		quantity: {type: Number, required: true, min: 0},
		category: {type: String, required: true},
		technicalData: {type: Array},
		primaryImage: {name: String, contentType: String, image: Buffer},
		images: [{name: String, contentType: String, image: Buffer}],
        rating: {type: Object, required: true}
	});
	const reviewScheme = new mongoose.Schema({
		product: {type: String, required: true},
		username: {type: String, required: true},
		review: {type: String, required: true},
		date: {type: String, required: true}
	});
	const technicalInformationScheme = new mongoose.Schema({
		title: {type: String, required: true}
	});
	const categoryScheme = new mongoose.Schema({
		title: {type: String, required: true},
		icon: {type: String, required: true}
	});
	const invoiceScheme = new mongoose.Schema({
		invoiceNumber: {type: Number, required: true, index: {unique: true}},
		userId: {type: String, required: true},
		paymentType: {type: String, required: true},
		products: {type: Array},
		totalPrice: {type: String, required: true},
		created: {type: String, required: true}
	});
	const homeSettingsScheme = new mongoose.Schema({
		message: {type: String},
		images: [{name: String, contentType: String, image: Buffer}]
	});
	const contactSettingsScheme = new mongoose.Schema({
		coordinates: {
			lat: {type: Number, required: true},
			lng: {type: Number, required: true}
		},
		street: {type: String, required: true},
		houseNumber: {type: String, required: true},
		city: {type: String, required: true},
		zipCode: {type: String, required: true},
		country: {type: String, required: true},
		mobileNumber: {type: String, required: true},
		email: {type: String, required: true}
	});
	const contactScheme = new mongoose.Schema({
		firstName: {type: String, required: true},
		lastName: {type: String, required: true},
		email: {type: String, required: true},
		mobileNumber: {type: String, required: true},
		message: {type: String, required: true},
		date: {type: String, required: true}
	});
	const messageScheme = new mongoose.Schema({
		chatId: {type: String},
		username: {type: String},
		message: {type: String},
		date: {type: String}
	});
    const models = {
		User: mongoose.model("User", userScheme),
		Product: mongoose.model("Product", productScheme),
		Review: mongoose.model("Review", reviewScheme),
		TechnicalInformation: mongoose.model("TechnicalInformation", technicalInformationScheme),
		Category: mongoose.model("Category", categoryScheme),
		Invoice: mongoose.model("Invoice", invoiceScheme),
		HomeSettings: mongoose.model("HomeSettings", homeSettingsScheme),
		ContactSettings: mongoose.model("ContactSettings", contactSettingsScheme),
		Contact: mongoose.model("Contact", contactScheme),
		Message: mongoose.model("Message", messageScheme)
	}
	return models;
}