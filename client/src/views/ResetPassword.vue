<template>
	<div id="resetPassword" class="container-fluid">
        <navigation></navigation>
        <div class="resetPasswordForm">
            <form autocomplete="off" @submit.prevent="resetPassword()">
                <div class="resetPasswordTitle">
                    <h1>Reset password</h1>
                    <p>Please insert the your new password.</p>
                    <hr>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <input type="password" id="password" class="form-control" :class="{'errorField' : passwordError}" placeholder="Password" v-model="user.password" ref="first" @focus="clearPasswordStatus()" @keypress="clearPasswordStatus()"/>
                        <div class="input-group-append">
                            <button type="button" class="btn btn-light" :class="{'errorIcon' : passwordError}" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
                        </div>
                    </div>
                    <small v-if="passwordError" class="form-text errorInput">Please provide a valid password!</small>
                </div>
                <div v-if="passwordReset" class="passwordResetSuccessful">Your password has been successfully reset!</div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-info" @click.prevent="login()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
                </div>
            </form>
        </div>
	</div>
</template>

<script>
	import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";
    import Navigation from "@/components/Navigation.vue";
	import Validation from "@/components/Validation.vue";
	import Helper from "@/components/Helper.vue";
	var axios = require("axios");

	export default {
		name: "resetPassword",
        components: {
            Navigation
        },
		data() {
			return {
				passwordError: false,
				user: {
					username: "",
					acceptanceToken: "",
					password: ""
				},
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
				var body = {username: this.user.username, isLoggedIn: false, acceptanceToken: this.user.acceptanceToken, password: this.user.password};
				axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/resetPassword", body).then(response => {
					if(response.data.reset) {
						this.passwordReset = true;
						this.$refs.first.focus();
						this.user.password = "";
						this.passwordError = false;
					} else {
						this.passwordError = true;
						this.passwordReset = false;
					}
				}).catch(error => console.log(error));
			},
			clearPasswordStatus() { this.passwordError = false; },
			togglePassword() {
				Helper.methods.togglePassword();
			}
		},
		computed: {
			invalidPassword() { return Validation.methods.invalidPassword(this.user.password); },
		},
		created() {
			this.user.username = this.$route.query.username;
			this.user.acceptanceToken = this.$route.query.acceptanceToken;
		}
	}
</script>

<style scoped>
	.resetPasswordForm {
		margin: 0 auto;
		max-width: 400px;
		text-align: center;
	}
	.resetPasswordTitle {
		margin-top: 20px;
        text-align: left;
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