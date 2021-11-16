<template>
	<div id="login" class="container-fluid">
		<div class="d-flex" id="pageContent">
			<sidebar></sidebar>
			<div id="pageStyle">
				<navigation></navigation>
				<form autocomplete="off" @submit.prevent="loginUser()" novalidate>
					<h1>Login</h1>
					<p>Please fill in this form to log in.</p>
					<hr>
					<div class="mb-3">
						<input type="text" id="username" class="form-control" :class="{'errorField' : errors.usernameError}" placeholder="Username" v-model="user.username" @keyup="checkUsername()" @change="checkUsername()" @focus="clearUsernameStatus()" @keypress="clearUsernameStatus()"/>
						<small v-if="errors.usernameError" class="errorInput">Please provide a valid username!</small>
					</div>
					<div class="mb-3">
						<div class="input-group">
							<input type="password" id="password" class="form-control" :class="{'errorField' : errors.passwordError && submitting}" placeholder="Password" v-model="user.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
							<div class="input-group-append">
								<button type="button" class="btn btn-light" :class="{'errorIcon' : errors.passwordError && submitting}" data-toggle="tooltip" title="Password has to have at least 8 characters, including uppercase and lowercase letters, digits and special characters." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye-slash"></i></button>
							</div>
						</div>
						<small v-if="errors.passwordError && submitting" class="errorInput">Please provide a valid password!</small>
					</div>
					<div v-if="errors.notConfirmed" class="mb-3 loginFailed">You have to confirm the registration!</div>
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
	</div>
</template>

<script>
	import navigation from "../components/Navigation.vue"; 
	import sidebar from "../components/Sidebar.vue";
	import helper from "../components/Helper.vue"; 
	import route from "../components/Route.vue";
	import validation from "../components/Validation.vue"; 
	const axios = require("axios");
	
	export default {
		name: "login",
		components: {
			navigation,
			sidebar
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
						if(response.data.isLoggedIn) this.openHome();
					}).catch(error => console.log(error));
				}
			},
			checkUsername() {
				if(this.user.username) {
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
				} else {
					this.errors.usernameError = false;
				}
			},
			loginUser() {
				this.submitting = true;
				this.clearUsernameStatus();
				this.clearPasswordStatus();
				var allowLogin = true;
				if(this.invalidUsername) {
					this.errors.usernameError = true;
					allowLogin = false;
				}
				if(this.invalidPassword) {
					this.errors.passwordError = true;
					allowLogin = false;
				}
				if(!allowLogin) {
					this.errors.noPasswordMatch = false;
					this.errors.notConfirmed = false;
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
							var user = response.data.user;
							var token = response.data.token;
							var isAdmin = response.data.isAdmin;
							this.$store.dispatch("login", {user, token, isAdmin});
							this.openHome();
						} else {
							if(response.data.found) {
								if(response.data.error == "notConfirmed") {
									this.errors.notConfirmed = true;
								} else {
									this.errors.noPasswordMatch = true;
								}
							} else {
								var errors = response.data.errors;
								errors.forEach(element => {
									this.errors[element + "Error"] = true;
								});
								this.errors.noPasswordMatch = false;
								this.errors.notConfirmed = false;
							}
						}
					}
				}).catch(error => console.log(error));
			},
			openHome() { 
				var isAdmin = this.$store.getters.isAdmin;
				if(isAdmin) route.methods.openProducts();
				else route.methods.openHome();
			},
			togglePassword() { helper.methods.togglePassword(); },
			openForgotCredentials() { route.methods.openForgotCredentials(); },
			openRegistration() { route.methods.openRegistration(); },
			clearUsernameStatus() { 
				this.errors.usernameError = false;
				this.errors.noPasswordMatch = false;
				this.errors.notConfirmed = false; 
			},
			clearPasswordStatus() { 
				this.errors.passwordError = false;
				this.errors.noPasswordMatch = false;
				this.errors.notConfirmed = false; 
			}
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
	form {
		margin: auto;
		max-width: 400px;
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