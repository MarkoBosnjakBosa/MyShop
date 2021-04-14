<template>
	<div id="profile" class="container-fluid">
		<navigation></navigation>
		<div class="profileForm">
            <div class="profileTitle">
                <h1>Profile</h1>
                <p>Here you can edit your account's information.</p>
                <hr>
            </div>
            <ul class="nav nav-tabs">
                <li class="nav-item"><a id="accountNavTab"  data-toggle="tab" href="#accountTab" class="nav-link active">Account</a></li>
                <li class="nav-item"><a id="addressNavTab" data-toggle="tab" href="#addressTab" class="nav-link">Address</a></li>
                <li class="nav-item"><a id="resetPasswordNavTab" data-toggle="tab" href="#resetPasswordTab" class="nav-link">Reset password</a></li>
            </ul>
            <div class="tab-content">
                <div id="accountTab" class="tab-pane fade active show">
                    <form autocomplete="off" @submit.prevent="editAccount()">
                        <div v-if="accountEdited" class="alert alert-success alert-dismissible" role="alert">
                            <div>Your account has been successfully edited!</div>
                            <button type="button" class="close" @click="closeAlert('accountEdited')">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="form-group">
                            <label for="username" class="form-label">Username:</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-user"></i></span>
                                <input type="text" id="username" class="form-control" :value="account.username" disabled/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email" class="form-label">Email:</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                <input type="text" id="email" class="form-control" :class="{'errorField' : emailError && accountSubmitting}" v-model="account.email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
                            </div>
                            <small v-if="emailError && accountSubmitting" class="form-text errorInput">Please provide a valid email!</small>
                        </div>
                        <div class="form-group">
                            <label for="firstName" class="form-label">First name:</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-pencil-alt"></i></span>
                                <input type="text" id="firstName" class="form-control" :class="{'errorField' : firstNameError && accountSubmitting}" v-model="account.firstName" @focus="clearFirstNameStatus()" @keypress="clearFirstNameStatus()"/>
                            </div>
                            <small v-if="firstNameError && accountSubmitting" class="form-text errorInput">Please provide a valid first name!</small>
                        </div>
                        <div class="form-group">
                            <label for="lastName" class="form-label">Last name:</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-pen"></i></span>
                                <input type="text" id="lastName" class="form-control" :class="{'errorField' : lastNameError && accountSubmitting}" v-model="account.lastName" @focus="clearLastNameStatus()" @keypress="clearLastNameStatus()"/>
                            </div>
                            <small v-if="lastNameError && accountSubmitting" class="form-text errorInput">Please provide a valid last name!</small>
                        </div>
                        <div class="form-group">
                            <label for="mobileNumber" class="form-label">Mobile number:</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-mobile-alt"></i></span>
                                <span class="input-group-text countryCodePrefix">+</span>
                                <input type="text" id="mobileNumber" class="form-control" :class="{'errorField' : mobileNumberError && accountSubmitting}" v-model="account.mobileNumber" @focus="clearMobileNumberStatus()" @keypress="clearMobileNumberStatus()"/>
                            </div>
                            <small class="form-text text-muted">Please insert your mobile number with the country calling code.</small>
                            <small v-if="mobileNumberError && accountSubmitting" class="form-text errorInput">Please provide a valid last name!</small>
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-info nextButton" @click="toggleTab('address')">Next <i class="fas fa-angle-double-right"></i></button>
                            <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
                        </div>
                    </form>
                </div>
                <div id="addressTab" class="tab-pane fade">
                    <form autocomplete="off" @submit.prevent="editAddress()">
                        <div v-if="addressEdited" class="alert alert-success alert-dismissible" role="alert">
                            <div>Your address has been successfully edited!</div>
                            <button type="button" class="close" @click="closeAlert('address')">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
						<div class="form-row">
							<div class="form-group col-md-8">
								<label for="street">Street:</label>
								<input type="text" id="street" class="form-control" :class="{'errorField' : streetError && addressSubmitting}" v-model="address.street" @focus="clearStreetStatus()" @keypress="clearStreetStatus()"/>
								<small v-if="(streetError || houseNumberError) && addressSubmitting" class="form-text errorInput">Please provide a valid street / house number!</small>
							</div>
							<div class="form-group col-md-4">
								<label for="houseNumber">House number:</label>
								<input type="number" id="houseNumber" class="form-control" :class="{'errorField' : houseNumberError && addressSubmitting}" v-model="address.houseNumber" @focus="clearStreetStatus()" @keypress="clearStreetStatus()"/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-group col-md-8">
								<label for="city">City:</label>
								<input type="text" id="city" class="form-control" :class="{'errorField' : cityError && addressSubmitting}" v-model="address.city" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
								<small v-if="(cityError || zipCodeError) && addressSubmitting" class="form-text errorInput">Please provide a valid city / zip code!</small>
							</div>
							<div class="form-group col-md-4">
								<label for="zipCode">Zip code:</label>
								<input type="number" id="zipCode" class="form-control" :class="{'errorField' : zipCodeError && addressSubmitting}" v-model="address.zipCode" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
							</div>
						</div>
						<div class="form-group">
							<label for="country" class="form-label">Country:</label>
							<input type="text" id="country" class="form-control" :class="{'errorField' : countryError && addressSubmitting}" v-model="address.country" @focus="clearCountryStatus()" @keypress="clearCountryStatus()"/>
							<small v-if="countryError && addressSubmitting" class="form-text errorInput">Please provide a valid country!</small>
						</div>
						<div class="form-group">
							<button type="button" class="btn btn-info previousButton" @click="toggleTab('account')"><i class="fas fa-angle-double-left"></i> Previous</button>
							<button type="button" class="btn btn-info nextButton" @click="toggleTab('resetPassword')">Next <i class="fas fa-angle-double-right"></i></button>
                            <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
						</div>
                    </form>
                </div>
                <div id="resetPasswordTab" class="tab-pane fade">
                    <form autocomplete="off" @submit.prevent="resetPassword()">
                        <div v-if="passwordReset" class="alert alert-success alert-dismissible" role="alert">
                            <div>Your password has been successfully reset!</div>
                            <button type="button" class="close" @click="closeAlert('resetPassword')">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="form-group">
							<label for="password" class="form-label">Password:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-lock"></i></span>
								<input type="password" id="password" class="form-control" :class="{'errorField' : passwordError}" v-model="password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
								<div class="input-group-append">
									<button type="button" class="btn btn-light" :class="{'errorIcon' : passwordError}" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
								</div>
							</div>
							<small v-if="passwordError" class="form-text errorInput">Please provide a valid password!</small>
						</div>
                        <div class="form-group">
                            <button type="button" class="btn btn-info previousButton" @click="toggleTab('address')"><i class="fas fa-angle-double-left"></i> Previous</button>
                            <button type="submit" class="btn btn-primary submitButton">Submit <i class="fas fa-check"></i></button>
						</div>
                    </form>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
	import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
	import navigation from "@/components/Navigation.vue";
	import validation from "@/components/Validation.vue";
	import helper from "@/components/Helper.vue";
	var axios = require("axios");
	
	export default {
		name: "profile",
		components: {
            navigation
        },
		data() {
			return {
                username: this.$store.getters.getUser,
				accountSubmitting: false,
				emailError: false,
				firstNameError: false,
				lastNameError: false,
				mobileNumberError: false,
				account: {
					username: "",
					email: "",
					password: "",
					firstName: "",
					lastName: "",
					mobileNumber: ""
				},
                accountEdited: false,
                addressSubmitting: false,
                streetError: false,
				houseNumberError: false,
				cityError: false,
				zipCodeError: false,
				countryError: false,
                address: {
                    street: "",
					houseNumber: "",
					city: "",
					zipCode: "",
					country: ""
                },
                addressEdited: false,
				passwordError: false,
                password: "",
                passwordReset: false
			}
		},
        methods: {
            getUser() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getUser/" + this.username).then(response => {
                    this.account = response.data.account;
                    this.address = response.data.address;
                }).catch(error => console.log(error));
            },
			editAccount() {
				this.accountSubmitting = true;
				this.clearEmailStatus();
				this.clearFirstNameStatus();
				this.clearLastNameStatus();
				this.clearMobileNumberStatus();
				var allowSubmit = true;
				if(this.invalidEmail) {
					this.emailError = true;
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
				if(!allowSubmit) {
					this.accountEdited = false;
                    return;
				}
				var body = {username: this.username, email: this.account.email, firstName: this.account.firstName, lastName: this.account.lastName, mobileNumber: this.account.mobileNumber};
				axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editAccount", body).then(response => {
					if(response.data.edited) {
						this.accountEdited = true;
                        this.emailError = false, this.firstNameError = false, this.lastNameError = false, this.mobileNumberError = false, this.accountSubmitting = false;
					} else {
						var errorFields = response.data.errorFields;
                        if(errorFields.includes("email")) this.emailError = true;
                        if(errorFields.includes("firstName")) this.firstNameError = true;
                        if(errorFields.includes("lastName")) this.lastNameError = true;
                        if(errorFields.includes("mobileNumber")) this.mobileNumberError = true;
                        this.userEdited = false;
					}
				}).catch(error => console.log(error));
			},
            editAddress() {
				this.addressSubmitting = true;
				this.clearStreetStatus();
				this.clearCityStatus();
                this.clearCountryStatus();
				var allowSubmit = true;
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
				if(!allowSubmit) {
					this.addressEdited = false;
					return;
				}
				var body = {username: this.username, street: this.address.street, houseNumber: this.address.houseNumber, city: this.address.city, zipCode: this.address.zipCode, country: this.address.country};
				axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editAddress", body).then(response => {
					if(response.data.edited) {
						this.addressEdited = true;
                        this.streetError = false, this.houseNumberError = false, this.cityError = false, this.zipCodeError = false, this.countryError = false, this.accountSubmitting = false;
					} else {
						var errorFields = response.data.errorFields;
                        if(errorFields.includes("street")) this.streetError = true;
                        if(errorFields.includes("houseNumber")) this.houseNumberError = true;
                        if(errorFields.includes("city")) this.cityError = true;
                        if(errorFields.includes("zipCode")) this.zipCodeError = true;
                        if(errorFields.includes("country")) this.countryError = true;
                        this.userEdited = false;
					}
				}).catch(error => console.log(error));
			},
            resetPassword() {
                this.clearPasswordStatus();
                if(this.invalidPassword) {
                    this.passwordError = true;
                    this.passwordReset = false;
                    return;
                }
                var body = {username: this.username, isLoggedIn: true, password: this.password};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/resetPassword", body).then(response => {
                    if(response.data.reset) {
                        this.passwordReset = true;
                        this.password = "";
                        this.passwordError = false;
                    } else {
                        this.passwordError = true;
                        this.passwordReset = false;
                    }
                }).catch(error => console.log(error));
            },
			clearEmailStatus() { this.emailError = false; },
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
            clearPasswordStatus() { this.passwordError = false; },
            togglePassword() {
				helper.methods.togglePassword();
			},
			toggleTab(tab) {
                helper.methods.toggleTab(tab);
			},
			closeAlert(type) {
                switch(type) {
                    case "account":
                        this.accountEdited = false;
                        break;
                    case "address":
                        this.addressEdited = false;
                        break;
                    case "resetPassword":
                        this.passwordReset = false;
                        break;
                }
			}
        },
        computed: {
			invalidEmail() { return validation.methods.invalidEmail(this.account.email); },
			invalidFirstName() { return validation.methods.invalidFirstName(this.account.firstName); },
			invalidLastName() { return validation.methods.invalidLastName(this.account.lastName); },
			invalidMobileNumber() { return validation.methods.invalidMobileNumber(this.account.mobileNumber); },
			invalidStreet() { return validation.methods.invalidStreet(this.address.street); },
			invalidHouseNumber() { return validation.methods.invalidHouseNumber(this.address.houseNumber); },
			invalidCity() { return validation.methods.invalidCity(this.address.city); },
			invalidZipCode() { return validation.methods.invalidZipCode(this.address.zipCode); },
			invalidCountry() { return validation.methods.invalidCountry(this.address.country); },
            invalidPassword() { return validation.methods.invalidPassword(this.account.password); }
		},
        created() {
            this.getUser();
        }
	}
</script>

<style scoped>
	.profileForm {
		margin: 0 auto;
		max-width: 500px;
	}
	.profileTitle {
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