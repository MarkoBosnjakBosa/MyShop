<template>
	<div id="registration" class="container-fluid">
		<form autocomplete="off" @submit.prevent="createUser()">
			<h1>Register</h1>
            <ul class="nav nav-tabs">
                <li class="nav-item"><a data-toggle="tab" href="#account" class="nav-link active">Account</a></li>
                <li class="nav-item"><a data-toggle="tab" href="#address" class="nav-link">Address</a></li>
            </ul>
            <div class="tab-content">
                <div id="account" class="tab-pane fade active show">
                    <div class="form-group">
                        <label for="username" class="form-label">Username</label>
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                            <input type="text" id="username" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                            <input type="text" id="email" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password" class="form-label">Password</label>
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                            <input type="password" id="password" class="form-control"/>
							<div class="input-group-append">
                                <button type="button" class="btn btn-light" data-toggle="tooltip" title="Password has to have at least 8 characters, one upper and lower case, one digit and a special character." @click="togglePassword()"><i id="togglePassword" class="fa fa-eye"></i></button>
							</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="firstName" class="form-label">First name</label>
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fas fa-pencil-alt"></i></span>
                            <input type="text" id="firstName" class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="lastName" class="form-label">Last name</label>
                        <div class="input-group mb-3">
                            <span class="input-group-text"><i class="fas fa-pen"></i></span>
                            <input type="text" id="lastName" class="form-control"/>
                        </div>
                    </div>
                </div>
                <div id="address" class="tab-pane fade">
                </div>
            </div>
		</form>
	</div>
</template>

<script>
	import "bootstrap";
	import "bootstrap/dist/css/bootstrap.min.css";

	var axios = require("axios");
	export default {
		name: "registration",
		data() {
			return {
				submitting: false,
				usernameError: false,
				emailError: false,
				passwordError: false,
				firstNameError: false,
				lastNameError: false,
				user: {
					username: "",
					email: "",
					password: "",
					firstName: "",
					lastName: ""
				},
				userCreated: false,
				alreadyExists: ""
			}
		},
        methods: {
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
        },
        computed: {
			invalidUsername() { 
				var usernameFormat = /^[a-z0-9_.-]*$/;
				if(this.user.username != "" && usernameFormat.test(this.user.username)) {
					return false;
				} else {
					return true;
				}
			},
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
			invalidLastName() { return this.user.lastName === ""; }
		}
	}
</script>

<style scoped>
    .input-group-text {
        border-right: 0px;
        border-radius: 0px;
    }
</style>