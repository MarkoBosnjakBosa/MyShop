<script>
    export default {
        name: "validation",
        methods: {
            invalidUsername(username) { 
				var usernameFormat = /^[a-z0-9_.-]*$/;
				if(username != "" && usernameFormat.test(username)) {
					return false;
				} else {
					return true;
				}
			},
			invalidEmail(email) {
				var emailFormat = /\S+@\S+\.\S+/;
				if(email != "" && emailFormat.test(email)) {
					return false;
				} else {
					return true;
				}
			},
			invalidPassword(password) {
				var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
				if(password != "" && passwordFormat.test(password)) {
					return false;
				} else {
					return true;
				}
			},
			invalidFirstName(firstName) { return firstName == ""; },
			invalidLastName(lastName) { return lastName == ""; },
			invalidMobileNumber(mobileNumber) {
				var mobileNumberFormat = /^[0-9]\d*$/;
				if(mobileNumber && mobileNumberFormat.test(mobileNumber)) return false;
				else return true;
			},
			invalidStreet(street) { return street == ""; },
			invalidHouseNumber(houseNumber) {
				var houseNumberFormat = /^[0-9]\d*$/;
				if(houseNumber && houseNumberFormat.test(houseNumber)) return false;
				else return true;
			},
			invalidCity(city) { return city == ""; },
			invalidZipCode(zipCode) {
				var zipCodeFormat = /^[0-9]\d*$/;
				if(zipCode && zipCodeFormat.test(zipCode)) return false;
				else return true;
			},
			invalidCountry(country) { return country == ""; },
			invalidAuthenticationToken(authenticationToken) { 
				var authenticationTokenFormat = /\d{6}/;
				if(authenticationToken != "" && authenticationTokenFormat.test(authenticationToken)) {
					return false;
				} else {
					return true;
				} 
			},
			invalidTitle(title) { return title == ""; },
			invalidIcon(icon) { return icon == ""; },
			invalidDescription(description) { return description == ""; },
			invalidPrice(price) {
				var priceFormat = /^[0-9]*\.[0-9]{2}$/;
				if(price != "" && priceFormat.test(price)) {
					return false;
				} else {
					return true;
				}
			},
			invalidQuantity(quantity) {
				var quantityFormat = /^[0-9]\d*$/;
				if(quantity != "" && quantityFormat.test(quantity)) {
					return false;
				} else {
					return true;
				}
			},
			invalidCategory(category) { return category == ""; },
			invalidPrimaryImage(primaryImage) { return primaryImage == ""; },
			invalidImages(images) {
				if(images < 10) {
					return false;
				} else {
					return true;
				}
			},
			invalidMessage(message) { return message == ""; },
			invalidRating(rating) { return rating < 1 || rating > 5; },
			invalidReview(review) { return review == ""},
			invalidMessage(message) { return message == ""},
			invalidFoundUser(user) { return user == ""},
			invalidLatitude(latitude) {
				if(latitude && !isNaN(latitude)) {
					return false;
				} else {
					return true;
				}
			},
			invalidLongitude(longitude) { 
				if(longitude && !isNaN(longitude)) {
					return false;
				} else {
					return true;
				}
			}
        }
    }
</script>