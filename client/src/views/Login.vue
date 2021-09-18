<template>
	<div id="login" class="container-fluid">
		<navigation></navigation>
		<div class="loginForm">
			<form autocomplete="off" @submit.prevent="loginUser()">
				<div class="loginTitle">
					<h1>Login</h1>
					<p>Please fill in this form to log in.</p>
					<hr>
				</div>
				<div class="mb-3">
					<input type="text" id="username" class="form-control" :class="{'errorField' : errors.usernameError}" placeholder="Username" v-model="user.username" @keyup="checkUsername()" @change="checkUsername()" @input="checkUsername()"/>
					<small v-if="errors.usernameError" class="errorInput">Please provide a valid username!</small>
				</div>
				<div class="mb-3">
					<div class="input-group">
						<input type="password" id="password" class="form-control" :class="{'errorField' : errors.passwordError && submitting}" placeholder="Password" v-model="user.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
						<div class="input-group-append">
							<button type="button" class="btn btn-light" :class="{'errorIcon' : errors.passwordError && submitting}" @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
						</div>
					</div>
					<small v-if="errors.passwordError && submitting" class="errorInput">Please provide a valid password!</small>
				</div>
				<div v-if="errors.notConfirmed" class="mb-3 loginFailed">You have to confirm your registration!</div>
				<div v-if="errors.noPasswordMatch" class="mb-3 loginFailed">Password does not match!</div>
				<div class="mb-3 forgotCredentials">
					<a href="#" @click="openForgotCredentials()">Forgot credentials?</a>
				</div>
				<div class="mb-3 submit">
					<button type="submit" class="btn btn-primary submitButton">Log in</button>
				</div>
				<div class="mb-3 register">Not a member? <a href="#" @click="openRegistration()">Register</a></div>
			</form>
		</div>
	</div>
</template>

<script>
	import navigation from "../components/Navigation.vue"; 
	import validation from "../components/Validation.vue";
	import helper from "../components/Helper.vue"; 
	import route from "../components/Route.vue"; 
	var axios = require("axios");
	
	export default {
		name: "login",
		components: {
			navigation
		},
		data() {
			return {
				submitting: false,
				user: {
					username: "",
					password: ""
				},
				errors: {
					usernameError: false,
					passwordError: false,
					notConfirmed: false,
					noPasswordMatch: false
				}
			}
		},
		methods: {
			checkLogin() {
				if(this.$store.getters.isLoggedIn) {
					axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/checkStatus").then(response => {
						if(response.data.loggedIn) this.openHome();
					}).catch(error => console.log(error));
				}
			},
			checkUsername() {
				var body = {username: this.user.username};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/checkUsername", body).then(response => {
					if(response.data.exists) {
						this.errors.usernameError = false;
					} else {
						if(response.data.empty) {
							this.errors.usernameError = false;
						} else {
							this.errors.usernameError = true;
						}
					}
				}).catch(error => console.log(error));
			},
			loginUser() {
				this.submitting = true;
				this.clearUsernameStatus();
				this.clearPasswordStatus();
				var allowSubmit = true;
				if(this.invalidUsername) {
					this.errors.usernameError = true;
					allowSubmit = false;
				}
				if(this.invalidPassword) {
					this.errors.passwordError = true;
					allowSubmit = false;
				}
				if(!allowSubmit) {
					this.errors.noPasswordMatch = false, this.errors.notConfirmed = false;
					return;
				}
				var body = {username: this.user.username, password: this.user.password};
				axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/login", body).then(response => {
					if(response.data.authentication) {
						this.user = {username: "", password: ""};
						this.errors = {usernameError: false, passwordError: false, noPasswordMatch: false, notConfirmed: false};
						this.submitting = false;
						var username = response.data.username;
						this.$store.dispatch("authenticate", username);
						route.methods.openAuthentication();
					} else {
						if(response.data.valid) {
							this.user = {username: "", password: ""};
							this.errors = {usernameError: false, passwordError: false, noPasswordMatch: false, notConfirmed: false};
							this.submitting = false;
							var token = response.data.token;
							var user = response.data.user;
							var isAdmin = response.data.isAdmin;
							this.$store.dispatch("login", {token, user, isAdmin});
							this.openHome();
						} else {
							if(response.data.found) {
								if(response.data.error == "notConfirmed") {
									this.errors.notConfirmed = true;
								} else {
									this.errors.noPasswordMatch = true;
								}
							} else {
								var errorFields = response.data.errorFields;
								if(errorFields.includes("username")) this.errors.usernameError = true;
								if(errorFields.includes("password")) this.errors.passwordError = true;
								this.errors.noPasswordMatch = false, this.errors.notConfirmed = false;
							}
						}
					}
				}).catch(error => console.log(error));
			},
			openForgotCredentials() { route.methods.openForgotCredentials(); },
			openRegistration() { route.methods.openRegistration(); },
			openHome() { 
				var isAdmin = this.$store.getters.isAdmin;
				if(isAdmin) route.methods.openProducts();
				else route.methods.openHome();
			},
			clearUsernameStatus() { this.errors.usernameError = false; },
			clearPasswordStatus() { this.errors.passwordError = false; },
			togglePassword() { helper.methods.togglePassword(); }
		},
		computed: {
			invalidUsername() { return validation.methods.invalidUsername(this.user.username); },
			invalidPassword() { return validation.methods.invalidPassword(this.user.password); }
		},
		created() {
			this.checkLogin();
		}
	}
</script>

<style scoped>
	.loginForm {
		margin: auto;
		max-width: 400px;
	}
	.loginTitle {
		margin-top: 20px;
	}
	.forgotCredentials {
		text-align: right;
	}
	.submitButton {
		width: 100%;
	}
	.submit, .register {
		text-align: center;
	}
	.loginFailed {
		color: #ff0000;
		margin-bottom: 10px;
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