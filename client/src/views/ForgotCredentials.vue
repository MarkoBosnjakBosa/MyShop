<template>
    <div id="forgotCredentials" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <form autocomplete="off" @submit.prevent="sendEmail()" novalidate>
                    <h1>Forgot credentials</h1>
                    <p>Please check an option.</p>
                    <hr>
                    <fieldset class="mb-3 options">
                        <div class="row">
                            <legend class="col-form-label col-2 pt-0">Forgot:</legend>
                            <div class="col-10">
                                <div class="form-check">
                                    <input type="radio" id="password" name="option" class="form-check-input" value="password" v-model="option" checked/>
                                    <label for="password" class="form-check-label">Password</label>
                                </div>
                                <div class="form-check">
                                    <input type="radio" id="username" name="option" class="form-check-input" value="username" v-model="option"/>
                                    <label for="username" class="form-check-label">Username</label>
                                </div>
                                <div class="form-check">
                                    <input type="radio" id="confirmation" name="option" class="form-check-input" value="confirmation" v-model="option"/>
                                    <label for="confirmation" class="form-check-label">Confirmation email</label>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <div class="mb-3">
                        <input type="text" id="email" class="form-control" :class="{'errorField' : emailError}" placeholder="Email" v-model="email" @focus="clearEmailStatus()" @keypress="clearEmailStatus()"/>
                        <small v-if="emailError" class="form-text errorInput">Please provide a valid email!</small>
                    </div>
                    <div v-if="emailSent" class="mb-3 emailSent">Please visit your inbox and follow suggested steps!</div>
                    <div class="mb-3">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                    <div class="mb-3">
                        <button type="button" class="btn btn-dark" @click="openLogin()">Proceed to login <i class="fas fa-hand-point-right"></i></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import navigation from "../components/Navigation.vue";
    import sidebar from "../components/Sidebar.vue";
    import route from "../components/Route.vue";
    import validation from "../components/Validation.vue";
    const axios = require("axios");

    export default {
        name: "forgotCredentials",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                option: "password",
                email: "",
                emailError: false,
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
                        this.option = "password";
                        this.email = "";
                        this.emailError = false;
                        this.emailSent = true;
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
    form {
        margin: auto;
        max-width: 400px;
        text-align: center;
        margin-top: 20px;
    }
    .options {
        text-align: left;
    }
    .emailSent {
        color: #008000;
    }
    .errorField {
        border: 1px solid #ff0000;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 6px #ff8080;
    }
    .errorInput {
        color: #ff0000;
    }
</style>