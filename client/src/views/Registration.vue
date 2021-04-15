<template>
	<div id="registration" class="container-fluid">
		<navigation></navigation>
		<div class="registrationForm">
			<form autocomplete="off" @submit.prevent="createUser()">
				<div class="registrationTitle">
					<h1>Register</h1>
					<p>Please fill in this form to create an account.</p>
					<hr>
				</div>
				<ul class="nav nav-tabs">
					<li class="nav-item"><a id="accountNavTab"  data-toggle="tab" href="#accountTab" class="nav-link active">Account</a></li>
					<li class="nav-item"><a id="addressNavTab" data-toggle="tab" href="#addressTab" class="nav-link">Address</a></li>
					<li class="nav-item"><a id="checkNavTab" data-toggle="tab" href="#checkTab" class="nav-link">Check</a></li>
				</ul>
				<div class="tab-content">
					<div id="accountTab" class="tab-pane fade active show">
						<div v-if="userCreated" class="alert alert-success alert-dismissible" role="alert">
							<div>User has been successfully created!</div>
							<div>Please visit your inbox and confirm your registration!</div>
							<button type="button" class="close" @click="closeRegistrationAlert()">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="form-group">
							<label for="username" class="form-label">Username:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-user"></i></span>
								<input type="text" id="username" class="form-control" :class="{'errorField' : usernameError && submitting}" v-model="user.username" ref="first" @focus="clearUsernameStatus()" @keypress="clearUsernameStatus()"/>
							</div>
							<small v-if="usernameError && submitting" class="form-text errorInput">Please provide a valid username!</small>
						</div>
						<div class="form-group">
							<label for="email" class="form-label">Email:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-envelope"></i></span>
								<input type="text" id="email" class="form-control" :class="{'errorField' : emailError && submitting}" v-model="user.email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
							</div>
							<small v-if="emailError && submitting" class="form-text errorInput">Please provide a valid email!</small>
						</div>
						<div class="form-group">
							<label for="password" class="form-label">Password:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-lock"></i></span>
								<input type="password" id="password" class="form-control" :class="{'errorField' : passwordError && submitting}" v-model="user.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
								<div class="input-group-append">
									<button type="button" class="btn btn-light" :class="{'errorIcon' : passwordError && submitting}" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
								</div>
							</div>
							<small v-if="passwordError && submitting" class="form-text errorInput">Please provide a valid password!</small>
						</div>
						<div class="form-group">
							<label for="firstName" class="form-label">First name:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-pencil-alt"></i></span>
								<input type="text" id="firstName" class="form-control" :class="{'errorField' : firstNameError && submitting}" v-model="user.firstName" @focus="clearFirstNameStatus()" @keypress="clearFirstNameStatus()"/>
							</div>
							<small v-if="firstNameError && submitting" class="form-text errorInput">Please provide a valid first name!</small>
						</div>
						<div class="form-group">
							<label for="lastName" class="form-label">Last name:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-pen"></i></span>
								<input type="text" id="lastName" class="form-control" :class="{'errorField' : lastNameError && submitting}" v-model="user.lastName" @focus="clearLastNameStatus()" @keypress="clearLastNameStatus()"/>
							</div>
							<small v-if="lastNameError && submitting" class="form-text errorInput">Please provide a valid last name!</small>
						</div>
						<div class="form-group">
							<label for="mobileNumber" class="form-label">Mobile number:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-mobile-alt"></i></span>
								<span class="input-group-text countryCodePrefix">+</span>
								<input type="text" id="mobileNumber" class="form-control" :class="{'errorField' : mobileNumberError && submitting}" v-model="user.mobileNumber" @focus="clearMobileNumberStatus()" @keypress="clearMobileNumberStatus()"/>
							</div>
							<small class="form-text text-muted">Please insert your mobile number with the country calling code.</small>
							<small v-if="mobileNumberError && submitting" class="form-text errorInput">Please provide a valid last name!</small>
						</div>
						<div class="form-group">
							<button type="button" class="btn btn-info nextButton" @click="toggleTab('address')">Next <i class="fas fa-angle-double-right"></i></button>
						</div>
					</div>
					<div id="addressTab" class="tab-pane fade">
						<div class="form-row">
							<div class="form-group col-md-8">
								<label for="street">Street:</label>
								<input type="text" id="street" class="form-control" :class="{'errorField' : streetError && submitting}" v-model="user.street" @focus="clearStreetStatus()" @keypress="clearStreetStatus()"/>
								<small v-if="(streetError || houseNumberError) && submitting" class="form-text errorInput">Please provide a valid street / house number!</small>
							</div>
							<div class="form-group col-md-4">
								<label for="houseNumber">House number:</label>
								<input type="number" id="houseNumber" class="form-control" :class="{'errorField' : houseNumberError && submitting}" v-model="user.houseNumber" @focus="clearStreetStatus()" @keypress="clearStreetStatus()"/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-group col-md-8">
								<label for="city">City:</label>
								<input type="text" id="city" class="form-control" :class="{'errorField' : cityError && submitting}" v-model="user.city" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
								<small v-if="(cityError || zipCodeError) && submitting" class="form-text errorInput">Please provide a valid city / zip code!</small>
							</div>
							<div class="form-group col-md-4">
								<label for="zipCode">Zip code:</label>
								<input type="number" id="zipCode" class="form-control" :class="{'errorField' : zipCodeError && submitting}" v-model="user.zipCode" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
							</div>
						</div>
						<div class="form-group">
							<label for="country" class="form-label">Country:</label>
							<input type="text" id="country" class="form-control" :class="{'errorField' : countryError && submitting}" v-model="user.country" @focus="clearCountryStatus()" @keypress="clearCountryStatus()"/>
							<small v-if="countryError && submitting" class="form-text errorInput">Please provide a valid country!</small>
						</div>
						<div class="form-group">
							<button type="button" class="btn btn-info previousButton" @click="toggleTab('account')"><i class="fas fa-angle-double-left"></i> Previous</button>
							<button type="button" class="btn btn-info nextButton" @click="toggleTab('check')">Next <i class="fas fa-angle-double-right"></i></button>
						</div>
					</div>
					<div id="checkTab" class="tab-pane fade">
						<div v-if="usernameError || emailError || passwordError || firstNameError || lastNameError || mobileNumberError || streetError || houseNumberError || cityError || zipCodeError || countryError || reCaptchaTokenError" class="alert alert-danger" role="alert">Please insert missing data!</div>
						<div v-if="alreadyExists == 'username'" class="alert alert-danger" role="alert">Username already exists!</div>
						<div v-if="alreadyExists == 'email'" class="alert alert-danger" role="alert">Email already exists!</div>
						<p :class="{'errorInput' : reCaptchaTokenError && submitting}">Please confirm that you are not a robot.</p>
						<div class="form-group text-xs-center">
							<div class="g-recaptcha" :data-sitekey="reCaptchaSiteKey"></div>
						</div>
						<button type="button" class="btn btn-info previousButton" @click="toggleTab('address')"><i class="fas fa-angle-double-left"></i> Previous</button>
						<button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import navigation from "../components/Navigation.vue";
	import validation from "../components/Validation.vue"; 
	import helper from "../components/Helper.vue"; 
	var axios = require("axios");

	export default {
		name: "registration",
		components: {
            navigation
        },
		data() {
			return {
				reCaptchaSiteKey: process.env.VUE_APP_RECAPTCHA_v2_SITE_KEY,
				submitting: false,
				usernameError: false,
				emailError: false,
				passwordError: false,
				firstNameError: false,
				lastNameError: false,
				mobileNumberError: false,
				streetError: false,
				houseNumberError: false,
				cityError: false,
				zipCodeError: false,
				countryError: false,
				reCaptchaTokenError: false,
				user: {
					username: "",
					email: "",
					password: "",
					firstName: "",
					lastName: "",
					mobileNumber: "",
					street: "",
					houseNumber: "",
					city: "",
					zipCode: "",
					country: ""
				},
				userCreated: false,
				alreadyExists: ""
			}
		},
        methods: {
			createUser() {
				this.submitting = true;
				this.clearUsernameStatus();
				this.clearEmailStatus();
				this.clearPasswordStatus();
				this.clearFirstNameStatus();
				this.clearLastNameStatus();
				this.clearMobileNumberStatus();
				this.clearStreetStatus();
				this.clearCityStatus();
				this.clearCountryStatus();
				this.clearReCaptchaTokenStatus();
				var allowSubmit = true;
				if(this.invalidUsername) {
					this.usernameError = true;
					allowSubmit = false;
				}
				if(this.invalidEmail) {
					this.emailError = true;
					allowSubmit = false;
				}
				if(this.invalidPassword) {
					this.passwordError = true;
					allowSubmit = false;
				}
				if(this.invalidFirstName) {
					this.firstNameError = true;
					allowSubmit = false;
				}
				if(this.invalidLastName) {
					this.lastNameError = true;
					allowSubmit = false;
				}
				if(this.invalidMobileNumber) {
					this.mobileNumberError = true;
					allowSubmit = false;
				}
				if(this.invalidStreet) {
					this.streetError = true;
					allowSubmit = false;
				}
				if(this.invalidHouseNumber) {
					this.houseNumberError = true;
					allowSubmit = false;
				}
				if(this.invalidCity) {
					this.cityError = true;
					allowSubmit = false;
				}
				if(this.invalidZipCode) {
					this.zipCodeError = true;
					allowSubmit = false;
				}
				if(this.invalidCountry) {
					this.countryError = true;
					allowSubmit = false;
				}
				if(grecaptcha.getResponse() == "" || grecaptcha.getResponse() == undefined || grecaptcha.getResponse() == null) {
					this.reCaptchaTokenError = true;
					allowSubmit = false;
				}
				if(!allowSubmit) {
					this.alreadyExists = "";
					this.userCreated = false;
					return;
				}
				var body = {username: this.user.username, email: this.user.email, password: this.user.password, firstName: this.user.firstName, lastName: this.user.lastName, mobileNumber: this.user.mobileNumber, street: this.user.street, houseNumber: this.user.houseNumber, city: this.user.city, zipCode: this.user.zipCode, country: this.user.country, reCaptchaToken: grecaptcha.getResponse()};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/createUser", body).then(response => {
					if(response.data.created) {
						this.userCreated = true;
						this.user = {username: "", email: "", password: "", firstName: "", lastName: "", mobileNumber: "", street: "", houseNumber: "", city: "", zipCode: "", country: ""};
						grecaptcha.reset();
						this.alreadyExists = "";
						this.usernameError = false, this.emailError = false, this.passwordError = false, this.firstNameError = false, this.lastNameError = false, this.mobileNumberError = false, this.streetError = false, this.houseNumberError = false, this.cityError = false, this.zipCodeError = false, this.countryError = false, this.reCaptchaTokenError = false, this.submitting = false;
						this.toggleTab("account");
						this.$refs.first.focus();
					} else {
						if(response.data.alreadyExists) {
							this.alreadyExists = response.data.field;
							this.userCreated = false;
						} else {
							var errorFields = response.data.errorFields;
							if(errorFields.includes("username")) this.usernameError = true;
							if(errorFields.includes("email")) this.emailError = true;
							if(errorFields.includes("password")) this.passwordError = true;
							if(errorFields.includes("firstName")) this.firstNameError = true;
							if(errorFields.includes("lastName")) this.lastNameError = true;
							if(errorFields.includes("mobileNumber")) this.mobileNumberError = true;
							if(errorFields.includes("street")) this.streetError = true;
							if(errorFields.includes("houseNumber")) this.houseNumberError = true;
							if(errorFields.includes("city")) this.cityError = true;
							if(errorFields.includes("zipCode")) this.zipCodeError = true;
							if(errorFields.includes("country")) this.countryError = true;
							if(errorFields.includes("reCaptchaToken")) this.reCaptchaTokenError = true;
							this.alreadyExists = "";
							this.userCreated = false;
						}
					}
				}).catch(error => console.log(error));
			},
			clearUsernameStatus() { this.usernameError = false; },
			clearEmailStatus() { this.emailError = false; },
			clearPasswordStatus() { this.passwordError = false; },
			clearFirstNameStatus() { this.firstNameError = false; },
			clearLastNameStatus() { this.lastNameError = false; },
			clearMobileNumberStatus() { this.mobileNumberError = false; },
			clearStreetStatus() { 
				this.streetError = false; 
				this.houseNumberError = false;
			},
			clearCityStatus() { 
				this.cityError = false; 
				this.zipCodeError = false;
			},
			clearCountryStatus() {
				this.countryError = false;
			},
			clearReCaptchaTokenStatus() {
				this.reCaptchaTokenError = false;
			},
            togglePassword() {
				helper.methods.togglePassword();
			},
			toggleTab(tab) {
                helper.methods.toggleTab(tab);
			},
			closeRegistrationAlert() {
				this.userCreated = false;
			}
        },
		mounted() {
			var reCaptchaScript = document.createElement("script");
			reCaptchaScript.setAttribute("src", "https://www.google.com/recaptcha/api.js");
			document.head.appendChild(reCaptchaScript);
		},
        computed: {
			invalidUsername() { return validation.methods.invalidUsername(this.user.username); },
			invalidEmail() { return validation.methods.invalidEmail(this.user.email); },
			invalidPassword() { return validation.methods.invalidPassword(this.user.password); },
			invalidFirstName() { return validation.methods.invalidFirstName(this.user.firstName); },
			invalidLastName() { return validation.methods.invalidLastName(this.user.lastName); },
			invalidMobileNumber() { return validation.methods.invalidMobileNumber(this.user.mobileNumber); },
			invalidStreet() { return validation.methods.invalidStreet(this.user.street); },
			invalidHouseNumber() { return validation.methods.invalidHouseNumber(this.user.houseNumber); },
			invalidCity() { return validation.methods.invalidCity(this.user.city); },
			invalidZipCode() { return validation.methods.invalidZipCode(this.user.zipCode); },
			invalidCountry() { return validation.methods.invalidCountry(this.user.country); }
		}
	}
</script>

<style scoped>
	.registrationForm {
		margin: 0 auto;
		max-width: 500px;
	}
	.registrationTitle {
		margin-top: 20px;
	}
	.tab-content {
		margin-top: 10px;
	}
	.countryCodePrefix {
		background-color: #fff;
	}
	.previousButton {
		float: left;
	}
	.nextButton, .submitButton {
		float: right;
	}
	.text-xs-center {
		text-align: center;
	}
	.g-recaptcha {
		display: inline-block;
	}
    .input-group-text {
        border-right: 0px;
        border-radius: 0px;
    }
	.errorField {
		border: 1px solid #ff0000;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
	}
	.errorIcon {
		border: 1px solid #ff0000;
		border-left: 0px;
		box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
	}
	.errorInput {
		color: #ff0000;
	}
</style>