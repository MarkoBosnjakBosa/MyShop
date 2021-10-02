<template>
	<div id="profile" class="container-fluid">
		<div class="d-flex" id="pageContent">
			<sidebar></sidebar>
			<div id="pageStyle">
				<navigation></navigation>
				<div class="profileInformation">
					<h1>Profile</h1>
					<p>Here you can edit your profile's information.</p>
					<hr>
					<div class="nav nav-tabs justify-content-center" role="tablist">
						<button type="button" id="accountNavTab" data-bs-toggle="tab" data-bs-target="#accountTab" class="nav-link active" role="tab">Account</button>
						<button type="button" id="addressNavTab" data-bs-toggle="tab" data-bs-target="#addressTab" class="nav-link" role="tab">Address</button>
						<button type="button" id="resetPasswordNavTab" data-bs-toggle="tab" data-bs-target="#resetPasswordTab" class="nav-link" role="tab">Reset password</button>
					</div>
					<div class="tab-content">
						<div id="accountTab" class="tab-pane fade active show" role="tabpanel">
							<form autocomplete="off" @submit.prevent="editAccount()">
								<div v-if="edits.accountEdited" class="alert alert-success alert-dismissible" role="alert">
									<div>Your account has been successfully edited.</div>
									<button type="button" class="btn-close" @click="closeAlert('account')"></button>
								</div>
								<div class="mb-3">
									<label for="username" class="form-label">Username:</label>
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-user"></i></span>
										<input type="text" id="username" class="form-control" :value="user.account.username" disabled/>
									</div>
								</div>
								<div class="mb-3">
									<label for="email" class="form-label">Email:</label>
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-envelope"></i></span>
										<input type="text" id="email" class="form-control" :class="{'errorField' : errors.account.emailError && submittings.accountSubmitting}" v-model="user.account.email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
									</div>
									<small v-if="errors.account.emailError && submittings.accountSubmitting" class="form-text errorInput">Please provide a valid email!</small>
								</div>
								<div class="mb-3">
									<label for="firstName" class="form-label">First name:</label>
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-pencil-alt"></i></span>
										<input type="text" id="firstName" class="form-control" :class="{'errorField' : errors.account.firstNameError && submittings.accountSubmitting}" v-model="user.account.firstName" @focus="clearFirstNameStatus()" @keypress="clearFirstNameStatus()"/>
									</div>
									<small v-if="errors.account.firstNameError && submittings.accountSubmitting" class="form-text errorInput">Please provide a valid first name!</small>
								</div>
								<div class="mb-3">
									<label for="lastName" class="form-label">Last name:</label>
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-pen"></i></span>
										<input type="text" id="lastName" class="form-control" :class="{'errorField' : errors.account.lastNameError && submittings.accountSubmitting}" v-model="user.account.lastName" @focus="clearLastNameStatus()" @keypress="clearLastNameStatus()"/>
									</div>
									<small v-if="errors.account.lastNameError && submittings.accountSubmitting" class="form-text errorInput">Please provide a valid last name!</small>
								</div>
								<div class="mb-3">
									<label for="mobileNumber" class="form-label">Mobile number:</label>
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-mobile-alt"></i></span>
										<span class="input-group-text countryCodePrefix">+</span>
										<input type="text" id="mobileNumber" class="form-control" :class="{'errorField' : errors.account.mobileNumberError && submittings.accountSubmitting}" v-model="user.account.mobileNumber" @focus="clearMobileNumberStatus()" @keypress="clearMobileNumberStatus()"/>
									</div>
									<small class="form-text text-muted">Please insert your mobile number with the country calling code.</small><br>
									<small v-if="errors.account.mobileNumberError && submittings.accountSubmitting" class="form-text errorInput">Please provide a valid mobile number!</small>
								</div>
								<div>
									<button type="button" class="btn btn-dark nextButton" @click="toggleTab('address')">Next <i class="fas fa-angle-double-right"></i></button>
									<button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
								</div>
							</form>
						</div>
						<div id="addressTab" class="tab-pane fade" role="tabpanel">
							<form autocomplete="off" @submit.prevent="editAddress()">
								<div v-if="edits.addressEdited" class="alert alert-success alert-dismissible" role="alert">
									<div>Your address has been successfully edited.</div>
									<button type="button" class="btn-close" @click="closeAlert('address')"></button>
								</div>
								<div class="row">
									<div class="mb-3 col-md-8">
										<label for="street">Street:</label>
										<input type="text" id="street" class="form-control" :class="{'errorField' : errors.address.streetError && submittings.addressSubmitting}" v-model="user.address.street" @focus="clearStreetStatus()" @keypress="clearStreetStatus()"/>
										<small v-if="(errors.address.streetError || errors.address.houseNumberError) && submittings.addressSubmitting" class="form-text errorInput">Please provide a valid street / house number!</small>
									</div>
									<div class="mb-3 col-md-4">
										<label for="houseNumber">House number:</label>
										<input type="number" id="houseNumber" min="0" class="form-control" :class="{'errorField' : errors.address.houseNumberError && submittings.addressSubmitting}" v-model="user.address.houseNumber" @focus="clearHouseNumberStatus()" @keypress="clearHouseNumberStatus()"/>
									</div>
								</div>
								<div class="row">
									<div class="mb-3 col-md-8">
										<label for="city">City:</label>
										<input type="text" id="city" class="form-control" :class="{'errorField' : errors.address.cityError && submittings.addressSubmitting}" v-model="user.address.city" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
										<small v-if="(errors.address.cityError || errors.address.zipCodeError) && submittings.addressSubmitting" class="form-text errorInput">Please provide a valid city / zip code!</small>
									</div>
									<div class="mb-3 col-md-4">
										<label for="zipCode">Zip code:</label>
										<input type="number" id="zipCode" min="0" class="form-control" :class="{'errorField' : errors.address.zipCodeError && submittings.addressSubmitting}" v-model="user.address.zipCode" @focus="clearZipCodeStatus()" @keypress="clearZipCodeStatus()"/>
									</div>
								</div>
								<div class="mb-3">
									<label for="country" class="form-label">Country:</label>
									<input type="text" id="country" class="form-control" :class="{'errorField' : errors.address.countryError && submittings.addressSubmitting}" v-model="user.address.country" @focus="clearCountryStatus()" @keypress="clearCountryStatus()"/>
									<small v-if="errors.address.countryError && submittings.addressSubmitting" class="form-text errorInput">Please provide a valid country!</small>
								</div>
								<div>
									<button type="button" class="btn btn-dark" @click="toggleTab('account')"><i class="fas fa-angle-double-left"></i> Previous</button>
									<button type="button" class="btn btn-dark nextButton" @click="toggleTab('resetPassword')">Next <i class="fas fa-angle-double-right"></i></button>
									<button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
								</div>
							</form>
						</div>
						<div id="resetPasswordTab" class="tab-pane fade" role="tabpanel">
							<form autocomplete="off" @submit.prevent="resetPassword()">
								<div v-if="edits.passwordReset" class="alert alert-success alert-dismissible" role="alert">
									<div>Your password has been successfully reset.</div>
									<button type="button" class="btn-close" @click="closeAlert('resetPassword')"></button>
								</div>
								<div class="mb-3">
									<label for="password" class="form-label">Password:</label>
									<div class="input-group">
										<span class="input-group-text"><i class="fas fa-lock"></i></span>
										<input type="password" id="password" class="form-control" :class="{'errorField' : errors.passwordError}" v-model="user.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
										<div class="input-group-append">
											<button type="button" class="btn btn-light" :class="{'errorIcon' : errors.passwordError}" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
										</div>
									</div>
									<small v-if="errors.passwordError" class="form-text errorInput">Please provide a valid password!</small>
								</div>
								<div>
									<button type="button" class="btn btn-dark previousButton" @click="toggleTab('address')"><i class="fas fa-angle-double-left"></i> Previous</button>
									<button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import checkLogin from "../components/CheckLogin.vue";
	import navigation from "../components/Navigation.vue";
	import sidebar from "../components/Sidebar.vue";
	import helper from "../components/Helper.vue";
	import validation from "../components/Validation.vue";
	const axios = require("axios");
	
	export default {
		name: "profile",
		components: {
			navigation,
			sidebar
		},
		data() {
			return {
				username: this.$store.getters.getUser,
				user: {
					account: {
						username: "",
						email: "",
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
					},
					password: ""
				},
				errors: {
					account: {
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
					passwordError: false,
				},
				submittings: {
					accountSubmitting: false,
					addressSubmitting: false,
				},
				edits: {
					accountEdited: false,
					addressEdited: false,
					passwordReset: false
				}
			}
		},
		methods: {
			getUser() {
				axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUser/" + this.username).then(response => {
					this.user.account = response.data.account;
					this.user.address = response.data.address;
				}).catch(error => console.log(error));
			},
			editAccount() {
				this.submittings.accountSubmitting = true;
				this.clearEmailStatus();
				this.clearFirstNameStatus();
				this.clearLastNameStatus();
				this.clearMobileNumberStatus();
				var allowEdit = true;
				if(this.invalidEmail) {
					this.errors.account.emailError = true;
					allowEdit = false;
				}
				if(this.invalidFirstName) {
					this.errors.account.firstNameError = true;
					allowEdit = false;
				}
				if(this.invalidLastName) {
					this.errors.account.lastNameError = true;
					allowEdit = false;
				}
				if(this.invalidMobileNumber) {
					this.errors.account.mobileNumberError = true;
					allowEdit = false;
				}
				if(!allowEdit) {
					this.edits.accountEdited = false;
					return;
				}
				var body = {account: this.user.account};
				axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editAccount", body).then(response => {
					if(response.data.edited) {
						this.errors.account = {emailError: false, passwordError: false, firstNameError: false, lastNameError: false, mobileNumberError: false};
						this.submittings.accountSubmitting = false;
						this.edits.accountEdited = true;
					} else {
						var errorFields = response.data.errorFields;
						if(errorFields.includes("email")) this.errors.account.emailError = true;
						if(errorFields.includes("firstName")) this.errors.account.firstNameError = true;
						if(errorFields.includes("lastName")) this.errors.account.lastNameError = true;
						if(errorFields.includes("mobileNumber")) this.errors.account.mobileNumberError = true;
						this.edits.accountEdited = false;
					}
				}).catch(error => console.log(error));
			},
			editAddress() {
				this.submittings.addressSubmitting = true;
				this.clearStreetStatus();
				this.clearHouseNumberStatus();
				this.clearCityStatus();
				this.clearZipCodeStatus();
				this.clearCountryStatus();
				var allowEdit = true;
				if(this.invalidStreet) {
					this.errors.address.streetError = true;
					allowEdit = false;
				}
				if(this.invalidHouseNumber) {
					this.errors.address.houseNumberError = true;
					allowEdit = false;
				}
				if(this.invalidCity) {
					this.errors.address.cityError = true;
					allowEdit = false;
				}
				if(this.invalidZipCode) {
					this.errors.address.zipCodeError = true;
					allowEdit = false;
				}
				if(this.invalidCountry) {
					this.errors.address.countryError = true;
					allowEdit = false;
				}
				if(!allowEdit) {
					this.edits.addressEdited = false;
					return;
				}
				var body = {username: this.username, address: this.user.address};
				axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editAddress", body).then(response => {
					if(response.data.edited) {
						this.errors.address = {streetError: false, houseNumberError: false, cityError: false, zipCodeError: false, countryError: false};
						this.submittings.addressSubmitting = false;
						this.edits.addressEdited = true;
					} else {
						var errorFields = response.data.errorFields;
						if(errorFields.includes("street")) this.errors.address.streetError = true;
						if(errorFields.includes("houseNumber")) this.errors.address.houseNumberError = true;
						if(errorFields.includes("city")) this.errors.address.cityError = true;
						if(errorFields.includes("zipCode")) this.errors.address.zipCodeError = true;
						if(errorFields.includes("country")) this.errors.address.countryError = true;
						this.edits.addressEdited = false;
					}
				}).catch(error => console.log(error));
			},
			resetPassword() {
				this.clearPasswordStatus();
				if(this.invalidPassword) {
					this.errors.passwordError = true;
					this.edits.passwordReset = false;
					return;
				}
				var body = {username: this.username, isLoggedIn: true, password: this.user.password};
				axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/resetPassword", body).then(response => {
					if(response.data.reset) {
						this.user.password = "";
						this.errors.passwordError = false;
						this.edits.passwordReset = true;
					} else {
						this.errors.passwordError = true;
						this.edits.passwordReset = false;
					}
				}).catch(error => console.log(error));
			},
			closeAlert(type) {
				switch(type) {
					case "account":
						this.edits.accountEdited = false;
						break;
					case "address":
						this.edits.addressEdited = false;
						break;
					case "resetPassword":
						this.edits.passwordReset = false;
						break;
				}
			},
			toggleTab(tab) { helper.methods.toggleTab(tab); },
			togglePassword() { helper.methods.togglePassword(); },
			clearEmailStatus() { this.errors.account.emailError = false; },
			clearFirstNameStatus() { this.errors.account.firstNameError = false; },
			clearLastNameStatus() { this.errors.account.lastNameError = false; },
			clearMobileNumberStatus() { this.errors.account.mobileNumberError = false; },
			clearStreetStatus() { this.errors.address.streetError = false; },
			clearHouseNumberStatus() { this.errors.address.houseNumberError = false; },
			clearCityStatus() { this.errors.address.cityError = false; },
			clearZipCodeStatus() { this.errors.address.zipCodeError = false; },
			clearCountryStatus() { this.errors.address.countryError = false; },
			clearPasswordStatus() { this.errors.passwordError = false; }
		},
		computed: {
			invalidEmail() { return validation.methods.invalidEmail(this.user.account.email); },
			invalidFirstName() { return validation.methods.invalidFirstName(this.user.account.firstName); },
			invalidLastName() { return validation.methods.invalidLastName(this.user.account.lastName); },
			invalidMobileNumber() { return validation.methods.invalidMobileNumber(this.user.account.mobileNumber); },
			invalidStreet() { return validation.methods.invalidStreet(this.user.address.street); },
			invalidHouseNumber() { return validation.methods.invalidHouseNumber(this.user.address.houseNumber); },
			invalidCity() { return validation.methods.invalidCity(this.user.address.city); },
			invalidZipCode() { return validation.methods.invalidZipCode(this.user.address.zipCode); },
			invalidCountry() { return validation.methods.invalidCountry(this.user.address.country); },
			invalidPassword() { return validation.methods.invalidPassword(this.user.password); }
		},
		created() {
			checkLogin.methods.isLoggedIn();
			this.getUser();
		}
	}
</script>

<style scoped>
	.profileInformation {
		margin: auto;
		max-width: 500px;
		margin-top: 20px;
	}
	.tab-content {
		margin-top: 10px;
	}
	.countryCodePrefix {
		background-color: #fff;
	}
	.nextButton {
		float: right;
		margin-left: 5px;
	}
	.submitButton {
		float: right;
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