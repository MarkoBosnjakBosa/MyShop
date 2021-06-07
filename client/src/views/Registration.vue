<template>
	<div id="registration" class="container-fluid">
		<navigation></navigation>
		<div class="registrationForm">
			<form autocomplete="off" @submit.prevent="registerUser()">
				<div class="registrationTitle">
					<h1>Register</h1>
					<p>Please fill in this form to create an account.</p>
					<hr>
				</div>
				<div class="nav nav-tabs justify-content-center" role="tablist">
                    <button type="button" id="accountNavTab" data-bs-toggle="tab" data-bs-target="#accountTab" class="nav-link active" role="tab">Account</button>
                    <button type="button" id="addressNavTab" data-bs-toggle="tab" data-bs-target="#addressTab" class="nav-link" role="tab">Address</button>
					<button type="button" id="checkNavTab" data-bs-toggle="tab" data-bs-target="#checkTab" class="nav-link" role="tab">Check</button>
                </div>
				<div class="tab-content">
					<div id="accountTab" class="tab-pane fade active show">
						<div v-if="userRegistered" class="alert alert-success alert-dismissible" role="alert">
							<div>User has been successfully registered!</div>
							<div>Please visit your inbox and confirm your registration!</div>
							<button type="button" class="btn-close" @click="closeRegistrationAlert()"></button>
						</div>
						<div class="mb-3">
							<label for="username" class="form-label">Username:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-user"></i></span>
								<input type="text" id="username" class="form-control" :class="{'errorField' : errors.account.usernameError && submitting}" v-model="user.account.username" @focus="clearUsernameStatus()" @keypress="clearUsernameStatus()"/>
							</div>
							<small v-if="errors.account.usernameError && submitting" class="form-text errorInput">Please provide a valid username!</small>
						</div>
						<div class="mb-3">
							<label for="email" class="form-label">Email:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-envelope"></i></span>
								<input type="text" id="email" class="form-control" :class="{'errorField' : errors.account.emailError && submitting}" v-model="user.account.email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
							</div>
							<small v-if="errors.account.emailError && submitting" class="form-text errorInput">Please provide a valid email!</small>
						</div>
						<div class="mb-3">
							<label for="password" class="form-label">Password:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-lock"></i></span>
								<input type="password" id="password" class="form-control" :class="{'errorField' : errors.account.passwordError && submitting}" v-model="user.account.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
								<div class="input-group-append">
									<button type="button" class="btn btn-light" :class="{'errorIcon' : errors.account.passwordError && submitting}" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
								</div>
							</div>
							<small v-if="errors.account.passwordError && submitting" class="form-text errorInput">Please provide a valid password!</small>
						</div>
						<div class="mb-3">
							<label for="firstName" class="form-label">First name:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-pencil-alt"></i></span>
								<input type="text" id="firstName" class="form-control" :class="{'errorField' : errors.account.firstNameError && submitting}" v-model="user.account.firstName" @focus="clearFirstNameStatus()" @keypress="clearFirstNameStatus()"/>
							</div>
							<small v-if="errors.account.firstNameError && submitting" class="form-text errorInput">Please provide a valid first name!</small>
						</div>
						<div class="mb-3">
							<label for="lastName" class="form-label">Last name:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-pen"></i></span>
								<input type="text" id="lastName" class="form-control" :class="{'errorField' : errors.account.lastNameError && submitting}" v-model="user.account.lastName" @focus="clearLastNameStatus()" @keypress="clearLastNameStatus()"/>
							</div>
							<small v-if="errors.account.lastNameError && submitting" class="form-text errorInput">Please provide a valid last name!</small>
						</div>
						<div class="mb-3">
							<label for="mobileNumber" class="form-label">Mobile number:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-mobile-alt"></i></span>
								<span class="input-group-text countryCodePrefix">+</span>
								<input type="text" id="mobileNumber" class="form-control" :class="{'errorField' : errors.account.mobileNumberError && submitting}" v-model="user.account.mobileNumber" @focus="clearMobileNumberStatus()" @keypress="clearMobileNumberStatus()"/>
							</div>
							<small class="form-text text-muted">Please insert your mobile number with the country calling code.</small><br>
							<small v-if="errors.account.mobileNumberError && submitting" class="form-text errorInput">Please provide a valid mobile number!</small>
						</div>
						<div>
							<button type="button" class="btn btn-dark nextButton" @click="toggleTab('address')">Next <i class="fas fa-angle-double-right"></i></button>
						</div>
					</div>
					<div id="addressTab" class="tab-pane fade">
						<div class="row">
							<div class="mb-3 col-md-8">
								<label for="street">Street:</label>
								<input type="text" id="street" class="form-control" :class="{'errorField' : errors.address.streetError && submitting}" v-model="user.address.street" @focus="clearStreetStatus()" @keypress="clearStreetStatus()"/>
								<small v-if="(errors.address.streetError || errors.address.houseNumberError) && submitting" class="form-text errorInput">Please provide a valid street / house number!</small>
							</div>
							<div class="mb-3 col-md-4">
								<label for="houseNumber">House number:</label>
								<input type="number" id="houseNumber" class="form-control" :class="{'errorField' : errors.address.houseNumberError && submitting}" v-model="user.address.houseNumber" @focus="clearStreetStatus()" @keypress="clearStreetStatus()"/>
							</div>
						</div>
						<div class="row">
							<div class="mb-3 col-md-8">
								<label for="city">City:</label>
								<input type="text" id="city" class="form-control" :class="{'errorField' : errors.address.cityError && submitting}" v-model="user.address.city" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
								<small v-if="(errors.address.cityError || errors.address.zipCodeError) && submitting" class="form-text errorInput">Please provide a valid city / zip code!</small>
							</div>
							<div class="mb-3 col-md-4">
								<label for="zipCode">Zip code:</label>
								<input type="number" id="zipCode" class="form-control" :class="{'errorField' : errors.address.zipCodeError && submitting}" v-model="user.address.zipCode" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
							</div>
						</div>
						<div class="mb-3">
							<label for="country" class="form-label">Country:</label>
							<input type="text" id="country" class="form-control" :class="{'errorField' : errors.address.countryError && submitting}" v-model="user.address.country" @focus="clearCountryStatus()" @keypress="clearCountryStatus()"/>
							<small v-if="errors.address.countryError && submitting" class="form-text errorInput">Please provide a valid country!</small>
						</div>
						<div>
							<button type="button" class="btn btn-dark previousButton" @click="toggleTab('account')"><i class="fas fa-angle-double-left"></i> Previous</button>
							<button type="button" class="btn btn-dark nextButton" @click="toggleTab('check')">Next <i class="fas fa-angle-double-right"></i></button>
						</div>
					</div>
					<div id="checkTab" class="tab-pane fade">
						<div v-if="errors.account.usernameError || errors.account.emailError || errors.account.passwordError || errors.account.firstNameError || errors.account.lastNameError || errors.account.mobileNumberError || errors.address.streetError || errors.address.houseNumberError || errors.address.cityError || errors.address.zipCodeError || errors.address.countryError || errors.reCaptchaTokenError" class="alert alert-danger" role="alert">Please insert missing data!</div>
						<div v-if="alreadyExists == 'username'" class="alert alert-danger" role="alert">Username already exists!</div>
						<div v-if="alreadyExists == 'email'" class="alert alert-danger" role="alert">Email already exists!</div>
						<p :class="{'errorInput' : errors.reCaptchaTokenError && submitting}">Please confirm that you are not a robot.</p>
						<div class="mb-3 recaptcha">
							<div class="g-recaptcha" :data-sitekey="reCaptchaSiteKey"></div>
						</div>
						<button type="button" class="btn btn-dark previousButton" @click="toggleTab('address')"><i class="fas fa-angle-double-left"></i> Previous</button>
						<button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
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
				user: {
					account: {
						username: "",
						email: "",
						password: "",
						firstName: "",
						lastName: "",
						mobileNumber: ""
					},
					address: {
						street: "",
						houseNumber: 0,
						city: "",
						zipCode: 0,
						country: ""
					}
				},
				errors: {
					account: {
						usernameError: false,
						emailError: false,
						passwordError: false,
						firstNameError: false,
						lastNameError: false,
						mobileNumberError: false
					},
					address: {
						streetError: false,
						houseNumberError: false,
						cityError: false,
						zipCodeError: false,
						countryError: false
					},
					reCaptchaTokenError: false
				},
				userRegistered: false,
				alreadyExists: ""
			}
		},
        methods: {
			registerUser() {
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
					this.errors.account.usernameError = true;
					allowSubmit = false;
				}
				if(this.invalidEmail) {
					this.errors.account.emailError = true;
					allowSubmit = false;
				}
				if(this.invalidPassword) {
					this.errors.account.passwordError = true;
					allowSubmit = false;
				}
				if(this.invalidFirstName) {
					this.errors.account.firstNameError = true;
					allowSubmit = false;
				}
				if(this.invalidLastName) {
					this.errors.account.lastNameError = true;
					allowSubmit = false;
				}
				if(this.invalidMobileNumber) {
					this.errors.account.mobileNumberError = true;
					allowSubmit = false;
				}
				if(this.invalidStreet) {
					this.errors.address.streetError = true;
					allowSubmit = false;
				}
				if(this.invalidHouseNumber) {
					this.errors.address.houseNumberError = true;
					allowSubmit = false;
				}
				if(this.invalidCity) {
					this.errors.address.cityError = true;
					allowSubmit = false;
				}
				if(this.invalidZipCode) {
					this.errors.address.zipCodeError = true;
					allowSubmit = false;
				}
				if(this.invalidCountry) {
					this.errors.address.countryError = true;
					allowSubmit = false;
				}
				if(grecaptcha.getResponse() == "" || grecaptcha.getResponse() == undefined || grecaptcha.getResponse() == null) {
					this.errors.reCaptchaTokenError = true;
					allowSubmit = false;
				}
				if(!allowSubmit) {
					this.alreadyExists = "";
					this.userRegistered = false;
					return;
				}
				var body = {user: this.user, reCaptchaToken: grecaptcha.getResponse()};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/registerUser", body).then(response => {
					if(response.data.registered) {
						this.userRegistered = true;
						this.user = {account: {username: "", email: "", password: "", firstName: "", lastName: "", mobileNumber: ""}, address:{ street: "", houseNumber: 0, city: "", zipCode: 0, country: ""}};
						grecaptcha.reset();
						this.alreadyExists = "";
						this.errors = {account: {usernameError: false, emailError: false, passwordError: false, firstNameError: false, lastNameError: false, mobileNumberError: false}, address: {streetError: false, houseNumberError: false, cityError: false, zipCodeError: false, countryError: false}, reCaptchaTokenError: false};
						this.submitting = false;
						this.toggleTab("account");
					} else {
						if(response.data.alreadyExists) {
							this.alreadyExists = response.data.field;
							this.userRegistered = false;
						} else {
							var errorFields = response.data.errorFields;
							if(errorFields.includes("username")) this.errors.account.usernameError = true;
							if(errorFields.includes("email")) this.errors.account.emailError = true;
							if(errorFields.includes("password")) this.errors.account.passwordError = true;
							if(errorFields.includes("firstName")) this.errors.account.firstNameError = true;
							if(errorFields.includes("lastName")) this.errors.account.lastNameError = true;
							if(errorFields.includes("mobileNumber")) this.errors.account.mobileNumberError = true;
							if(errorFields.includes("street")) this.errors.address.streetError = true;
							if(errorFields.includes("houseNumber")) this.errors.address.houseNumberError = true;
							if(errorFields.includes("city")) this.errors.address.cityError = true;
							if(errorFields.includes("zipCode")) this.errors.address.zipCodeError = true;
							if(errorFields.includes("country")) this.errors.address.countryError = true;
							if(errorFields.includes("reCaptchaToken")) this.errors.reCaptchaTokenError = true;
							this.alreadyExists = "";
							this.userRegistered = false;
						}
					}
				}).catch(error => console.log(error));
			},
			loadReCaptcha() {
				var reCaptchaScript = document.createElement("script");
				reCaptchaScript.setAttribute("src", "https://www.google.com/recaptcha/api.js");
				document.head.appendChild(reCaptchaScript);
			},
			clearUsernameStatus() { this.errors.account.usernameError = false; },
			clearEmailStatus() { this.errors.account.emailError = false; },
			clearPasswordStatus() { this.errors.account.passwordError = false; },
			clearFirstNameStatus() { this.errors.account.firstNameError = false; },
			clearLastNameStatus() { this.errors.account.lastNameError = false; },
			clearMobileNumberStatus() { this.errors.account.mobileNumberError = false; },
			clearStreetStatus() { 
				this.errors.address.streetError = false; 
				this.errors.address.houseNumberError = false;
			},
			clearCityStatus() { 
				this.errors.address.cityError = false; 
				this.errors.address.zipCodeError = false;
			},
			clearCountryStatus() { this.errors.address.countryError = false; },
			clearReCaptchaTokenStatus() { this.errors.reCaptchaTokenError = false; },
            togglePassword() { helper.methods.togglePassword(); },
			toggleTab(tab) { helper.methods.toggleTab(tab); },
			closeRegistrationAlert() { this.userRegistered = false; }
        },
        computed: {
			invalidUsername() { return validation.methods.invalidUsername(this.user.account.username); },
			invalidEmail() { return validation.methods.invalidEmail(this.user.account.email); },
			invalidPassword() { return validation.methods.invalidPassword(this.user.account.password); },
			invalidFirstName() { return validation.methods.invalidFirstName(this.user.account.firstName); },
			invalidLastName() { return validation.methods.invalidLastName(this.user.account.lastName); },
			invalidMobileNumber() { return validation.methods.invalidMobileNumber(this.user.account.mobileNumber); },
			invalidStreet() { return validation.methods.invalidStreet(this.user.address.street); },
			invalidHouseNumber() { return validation.methods.invalidHouseNumber(this.user.address.houseNumber); },
			invalidCity() { return validation.methods.invalidCity(this.user.address.city); },
			invalidZipCode() { return validation.methods.invalidZipCode(this.user.address.zipCode); },
			invalidCountry() { return validation.methods.invalidCountry(this.user.address.country); }
		},
		mounted() {
			this.loadReCaptcha();
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
	.recaptcha {
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