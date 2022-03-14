<template>
    <div id="setup" class="container-fluid">
        <div class="d-flex" id="pageContent">
            <sidebar></sidebar>
            <div id="pageStyle">
                <navigation></navigation>
                <div class="setupInformation">
                    <div class="setupTitle">
                        <h1>Setup</h1>
                        <div>
                            <span>Enable / disable authentication.</span>
                            <span v-if="authenticationEnabled" class="badge bg-primary text-light">Enabled</span>
                            <span v-else class="badge bg-danger text-light">Disabled</span>
                        </div>
                        <hr>
                    </div>
                    <div v-if="authenticationEnabled">
                        <div class="mb-3">
                            Disable 2fa authentication.<br>
                            SMS authentication will not be required, when logging in.
                        </div>
                        <button type="button" class="btn btn-danger" @click="setAuthentication(false)">Disable authentication</button>
                    </div>
                    <div v-else>
                        <div class="mb-3">
                            Enable 2fa authentication.<br>
                            SMS authentication will be required, when logging in.
                        </div>
                        <div class="mb-3">
                            <button type="button" class="btn btn-primary" @click="sendAuthenticationEnablingToken()">Send token</button>
                            <div v-if="authenticationEnablingTokenSent" class="authenticationEnablingTokenSent">
                                <small class="form-text">
                                    Authentication token has been sent to your mobile phone.<br>
                                    Please insert the token and enable the authentication.
                                </small>
                            </div>
                        </div>
                        <form autocomplete="off" @submit.prevent="setAuthentication(true)" novalidate>
                            <div class="input-group">
                            <input type="text" id="authenticationTestToken" class="form-control" :class="{'errorField' : authenticationEnablingTokenError}" placeholder="Authentication token" v-model="authenticationEnablingToken" @focus="clearAuthenticationEnablingTokenStatus()" @keypress="clearAuthenticationEnablingTokenStatus()"/>
                                <div class="input-group-append">
                                    <button type="submit" class="btn btn-primary">Enable</button>
                                </div>
                            </div>
                            <small v-if="authenticationEnablingTokenError" class="form-text errorInput">Please provide a valid authentication token!</small>
                        </form>
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
    import route from "../components/Route.vue";  
    import validation from "../components/Validation.vue";
    const axios = require("axios");
	
    export default {
        name: "setup",
        components: {
            navigation,
            sidebar
        },
        data() {
            return {
                username: this.$store.getters.getUser,
                authenticationEnabled: false,
                authenticationEnablingToken: "",
                authenticationEnablingTokenError: false,
                authenticationEnablingTokenSent: false
            }
        },
        methods: {
            getAuthentication() {
                axios.get(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/getAuthentication/" + this.username).then(response => {
                    this.authenticationEnabled = response.data.authenticationEnabled;
                }).catch(error => console.log(error));
            },
            setAuthentication(authenticationEnabled) {
                var body = {};
                if(authenticationEnabled) {
                    this.clearAuthenticationEnablingTokenStatus();
                    if(this.invalidAuthenticationEnablingToken) {
                        this.authenticationEnablingTokenError = true;
                        return;
                    }
                    body = {username: this.username, authenticationEnabled: authenticationEnabled, authenticationEnablingToken: this.authenticationEnablingToken};
                } else {
                    body = {username: this.username, authenticationEnabled: authenticationEnabled};
                }
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/setAuthentication", body).then(response => {
                    if(response.data.valid) {
                        this.authenticationEnabled = response.data.authenticationEnabled;
                        this.authenticationEnablingToken = "";
                        this.authenticationEnablingTokenError = false;
                        this.authenticationEnablingTokenSent = false;
                    } else {
                        var errors = response.data.errors;
                        errors.forEach(element => {
                            this[element + "Error"] = true;
                        });
                    }
                }).catch(error => console.log(error));
            },
            sendAuthenticationEnablingToken() {
                var body = {username: this.username};
                axios.put(process.env.VUE_APP_BASE_URL + process.env.VUE_APP_SERVER_PORT + "/sendAuthenticationEnablingToken", body).then(response => {
                    this.authenticationEnablingTokenSent = response.data.authenticationEnablingTokenSent;
                }).catch(error => console.log(error));
            },
            clearAuthenticationEnablingTokenStatus() { this.authenticationEnablingTokenError = false; }
        },
        computed: {
            invalidAuthenticationEnablingToken() { return validation.methods.invalidAuthenticationToken(this.authenticationEnablingToken); }
        },
        created() {
            var temp = this;
            checkLogin.methods.isLoggedIn(function(isLoggedIn) {
                if(isLoggedIn) temp.getAuthentication();
                else route.methods.openLogin();
            });
        }
    }
</script>

<style scoped>
    .setupInformation {
        margin: auto;
        max-width: 450px;
    }
    .setupTitle {
        margin-top: 20px;
    }
    .badge {
        float: right;
    }
    .authenticationEnablingTokenSent {
        margin-top: 10px;
    }
    .authenticationEnablingTokenSent .form-text {
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