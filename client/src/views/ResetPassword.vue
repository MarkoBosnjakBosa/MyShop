<template>
	<div id="resetPassword" class="container-fluid">
		<div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
				<navigation></navigation>
				<form autocomplete="off" @submit.prevent="resetPassword()">
					<h1>Reset password</h1>
					<p>Please insert your new password.</p>
					<hr>
					<div class="mb-3">
						<div class="input-group">
							<input type="password" id="password" class="form-control" :class="{'errorField' : passwordError}" placeholder="Password" v-model="user.password" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
							<div class="input-group-append">
								<button type="button" class="btn btn-light" :class="{'errorIcon' : passwordError}" data-toggle="tooltip" title="Password has to have at least 8 characters, including uppercase and lowercase letters, digits and special characters." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
							</div>
						</div>
						<small v-if="passwordError" class="form-text errorInput">Please provide a valid password!</small>
					</div>
					<div v-if="passwordReset" class="passwordResetSuccessful">Your password has been successfully reset!</div>
					<div class="mb-3">
						<button type="submit" class="btn btn-primary">Submit</button>
					</div>
					<div>
						<button type="button" class="btn btn-dark" @click.prevent="openLogin()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
					</div>
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
		name: "resetPassword",
		components: {
			navigation,
			sidebar
		},
		data() {
			return {
				user: {
					username: "",
					resetPasswordToken: "",
					password: ""
				},
				passwordError: false,
				passwordReset: false
			}
		},
		methods: {
			resetPassword() {
				this.clearPasswordStatus();
				if(this.invalidPassword) {
					this.passwordError = true;
					this.passwordReset = false;
					return;
				}
				var body = {username: this.user.username, isLoggedIn: false, resetPasswordToken: this.user.resetPasswordToken, password: this.user.password};
				axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/resetPassword", body).then(response => {
					if(response.data.reset) {
						this.user.password = "";
						this.passwordError = false;
						this.passwordReset = true;
					} else {
						this.passwordError = true;
						this.passwordReset = false;
					}
				}).catch(error => console.log(error));
			},
			togglePassword() { helper.methods.togglePassword(); },
			openLogin() { route.methods.openLogin(); },
			clearPasswordStatus() { 
				this.passwordError = false;
				this.passwordReset = false;
			}
		},
		computed: {
			invalidPassword() { return validation.methods.invalidPassword(this.user.password); }
		},
		created() {
			this.user.username = this.$route.query.username;
			this.user.resetPasswordToken = this.$route.query.resetPasswordToken;
		}
	}
</script>

<style scoped>
	form {
		margin: auto;
		max-width: 400px;
		text-align: center;
		margin-top: 20px;
	}
	.passwordResetSuccessful {
		color: #008000;
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