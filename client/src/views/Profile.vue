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
                            <button type="button" class="close" @click="closeAccountEditedAlert()">
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
                            <small class="form-text text-muted">Please insert the mobile number with country calling code.</small>
                            <small v-if="mobileNumberError && accountSubmitting" class="form-text errorInput">Please provide a valid last name!</small>
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-info nextButton" @click="toggleAddressTab()">Next <i class="fas fa-angle-double-right"></i></button>
                        </div>
                    </form>
                </div>
                <div id="addressTab" class="tab-pane fade">
                    <form autocomplete="off" @submit.prevent="editAddress()">
                        <div v-if="addressEdited" class="alert alert-success alert-dismissible" role="alert">
                            <div>Your address has been successfully edited!</div>
                            <button type="button" class="close" @click="closeAddressEditedAlert()">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
						<div class="form-row">
							<div class="form-group col-md-8">
								<label for="address">Address:</label>
								<input type="text" id="address" class="form-control" :class="{'errorField' : addressError && submitting}" v-model="address.address" @focus="clearAddressStatus()" @keypress="clearAddressStatus()"/>
								<small v-if="(addressError || houseNumberError) && submitting" class="form-text errorInput">Please provide a valid address!</small>
							</div>
							<div class="form-group col-md-4">
								<label for="houseNumber">House number:</label>
								<input type="number" id="houseNumber" class="form-control" :class="{'errorField' : houseNumberError && submitting}" v-model="address.houseNumber" @focus="clearAddressStatus()" @keypress="clearAddressStatus()"/>
							</div>
						</div>
						<div class="form-row">
							<div class="form-group col-md-8">
								<label for="city">City:</label>
								<input type="text" id="city" class="form-control" :class="{'errorField' : cityError && submitting}" v-model="address.city" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
								<small v-if="(cityError || zipCodeError) && submitting" class="form-text errorInput">Please provide a valid city!</small>
							</div>
							<div class="form-group col-md-4">
								<label for="zipCode">Zip code:</label>
								<input type="number" id="zipCode" class="form-control" :class="{'errorField' : zipCodeError && submitting}" v-model="address.zipCode" @focus="clearCityStatus()" @keypress="clearCityStatus()"/>
							</div>
						</div>
						<div class="form-group">
							<label for="country" class="form-label">Country:</label>
							<input type="text" id="country" class="form-control" :class="{'errorField' : countryError && submitting}" v-model="address.country" @focus="clearCountryStatus()" @keypress="clearCountryStatus()"/>
							<small v-if="countryError && submitting" class="form-text errorInput">Please provide a valid country!</small>
						</div>
						<div class="form-group">
							<button type="button" class="btn btn-info previousButton" @click="toggleAccountTab()"><i class="fas fa-angle-double-left"></i> Previous</button>
							<button type="button" class="btn btn-info nextButton" @click="toggleCheckTab()">Next <i class="fas fa-angle-double-right"></i></button>
						</div>
                    </form>
                </div>
                <div id="resetPasswordTab" class="tab-pane fade">
                    <form autocomplete="off" @submit.prevent="resetPassword()">
                        <div v-if="passwordReset" class="alert alert-success alert-dismissible" role="alert">
                            <div>Your password has been successfully reset!</div>
                            <button type="button" class="close" @click="closePasswordResetAlert()">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="form-group">
							<label for="password" class="form-label">Password:</label>
							<div class="input-group">
								<span class="input-group-text"><i class="fas fa-lock"></i></span>
								<input type="password" id="password" class="form-control" :class="{'errorField' : passwordError && submitting}" v-model="account.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
								<div class="input-group-append">
									<button type="button" class="btn btn-light" :class="{'errorIcon' : passwordError && submitting}" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
								</div>
							</div>
							<small v-if="passwordError && submitting" class="form-text errorInput">Please provide a valid password!</small>
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
	import Navigation from "@/components/Navigation.vue";

	var axios = require("axios");
	export default {
		name: "profile",
		components: {
            Navigation
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
                addressError: false,
				houseNumberError: false,
				cityError: false,
				zipCodeError: false,
				countryError: false,
                address: {
                    address: "",
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
				var allowAccountSubmit = true;
				if(this.invalidEmail) {
					this.emailError = true;
					allowAccountSubmit = false;
				}
				if(this.invalidFirstName) {
					this.firstNameError = true;
					allowAccountSubmit = false;
				}
				if(this.invalidLastName) {
					this.lastNameError = true;
					allowAccountSubmit = false;
				}
				if(this.invalidMobileNumber) {
					this.mobileNumberError = true;
					allowAccountSubmit = false;
				}
				if(!allowAccountSubmit) {
					this.alreadyExists = "";
					this.userCreated = false;
					return;
				}
				var body = {username: this.username, email: this.account.email, firstName: this.account.firstName, lastName: this.account.lastName, mobileNumber: this.account.mobileNumber};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/editAccount", body).then(response => {
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
			clearEmailStatus() { this.emailError = false; },
			clearPasswordStatus() { this.passwordError = false; },
			clearFirstNameStatus() { this.firstNameError = false; },
			clearLastNameStatus() { this.lastNameError = false; },
			clearMobileNumberStatus() { this.mobileNumberError = false; },
			clearAddressStatus() { 
				this.addressError = false; 
				this.houseNumberError = false;
			},
			clearCityStatus() { 
				this.cityError = false; 
				this.zipCodeError = false;
			},
			clearCountryStatus() {
				this.countryError = false;
			},
            togglePassword() {
				var type = document.getElementById("password").getAttribute("type");
				switch(type) {
					case "password": {
						document.getElementById("password").setAttribute("type", "text");
						document.getElementById("togglePassword").classList.remove("fa-eye");
						document.getElementById("togglePassword").classList.add("fa-eye-slash");
						return;
					}
					case "text": {
						document.getElementById("password").setAttribute("type", "password");
						document.getElementById("togglePassword").classList.remove("fa-eye-slash");
						document.getElementById("togglePassword").classList.add("fa-eye");
						return;
					}
				}
			},
			toggleAccountTab() {
				document.getElementById("accountNavTab").click();
			},
			toggleAddressTab() {
				document.getElementById("addressNavTab").click();
			},
			toggleCheckTab() {
				document.getElementById("checkNavTab").click();
			},
			closeRegistrationAlert() {
				this.userCreated = false;
			}
        },
        computed: {
			invalidEmail() {
				var emailFormat = /\S+@\S+\.\S+/;
				if(this.user.email != "" && emailFormat.test(this.user.email)) {
					return false;
				} else {
					return true;
				}
			},
			invalidPassword() {
				var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
				if(this.user.password != "" && passwordFormat.test(this.user.password)) {
					return false;
				} else {
					return true;
				}
			},
			invalidFirstName() { return this.user.firstName === ""; },
			invalidLastName() { return this.user.lastName === ""; },
			invalidMobileNumber() {
				var mobileNumberFormat = /^[0-9]\d*$/;
				if(this.user.mobileNumber != "" && mobileNumberFormat.test(this.user.mobileNumber)) {
					return false;
				} else {
					return true;
				}
			},
			invalidAddress() { return this.user.address === ""; },
			invalidHouseNumber() {
				var houseNumberFormat = /^[0-9]\d*$/;
				if(this.user.houseNumber != "" && houseNumberFormat.test(this.user.houseNumber)) {
					return false;
				} else {
					return true;
				}
			},
			invalidCity() { return this.user.address === ""; },
			invalidZipCode() {
				var zipCodeFormat = /^[0-9]\d*$/;
				if(this.user.zipCode != "" && zipCodeFormat.test(this.user.zipCode)) {
					return false;
				} else {
					return true;
				}
			},
			invalidCountry() { return this.user.country === ""; }
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