<template>
    <div id="forgotCredentials" class="container-fluid">
        <navigation></navigation>
        <div class="forgotCredentialsForm">
            <form autocomplete="off" @submit.prevent="sendEmail()">
                <div class="forgotCredentialsTitle">
					<h1>Forgot credentials</h1>
					<p>Please check an option.</p>
					<hr>
				</div>
                <fieldset class="mb-3 options">
                    <div class="row">
                        <legend class="col-form-label col-md-2 pt-0">Forgot:</legend>
                        <div class="col-md-10">
                            <div class="form-check">
                                <input type="radio" name="option" id="password" class="form-check-input" value="password" v-model="option" checked/>
                                <label for="password" class="form-check-label">Password</label>
                            </div>
                            <div class="form-check">
                                <input type="radio" name="option" id="username" class="form-check-input" value="username" v-model="option"/>
                                <label for="username" class="form-check-label">Username</label>
                            </div>
                            <div class="form-check">
                                <input type="radio" name="option" id="confirmation" class="form-check-input" value="confirmation" v-model="option"/>
                                <label for="confirmation" class="form-check-label">Confirmation email</label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div class="mb-3 emailDiv">
                    <input type="text" id="email" class="form-control" placeholder="Email" v-model="email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
                    <small v-if="emailError" class="form-text errorInput">Please provide a valid email!</small>
                </div>
                <div v-if="emailSent" class="form-group emailSentSuccessful">Please visit your inbox and follow suggested steps!</div>
                <div class="mb-3 submitDiv">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
                <div class="mb-3 loginDiv">
                    <button type="button" class="btn btn-dark" @click="openLogin()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
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
    import route from "../components/Route.vue";
    var axios = require("axios");

    export default {
        name: "forgotCredentials",
        components: {
            navigation
        },
        data() {
            return {
                emailError: false,
                option: "password",
                email: "",
                emailSent: false
            }
        },
        methods: {
            sendEmail() {
                this.clearEmailStatus();
                if(this.invalidEmail) {
                    this.emailError = true;
                    this.emailSent = false;
                    return;
                }
                var body = {option: this.option, email: this.email};
                axios.post(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/forgotCredentials", body).then(response => {
                    if(response.data.sent) {
                        this.emailSent = true;
                        this.option = "password";
                        this.email = "";
                        this.emailError = false;
                    } else {
                        this.emailError = true;
                        this.emailSent = false;
                    }
                }).catch(error => console.log(error));
            },
            clearEmailStatus() { 
                this.emailError = false;
                this.emailSent = false; 
            },
            openLogin() {
                route.methods.openLogin();
            }
        },
        computed: {
            invalidEmail() { return validation.methods.invalidEmail(this.email); }
        }
    }
</script>

<style scoped>
    .forgotCredentialsForm {
        margin: 0 auto;
        max-width: 400px;
        text-align: center;
    }
    .forgotCredentialsTitle {
        margin-top: 20px;
        text-align: left;
    }
    .options {
        text-align: left;
    }
    .emailDiv, .submitDiv, .loginDiv {
        text-align: center;
    }
    .emailSentSuccessful {
        color: #008000;
        margin-bottom: 10px;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>